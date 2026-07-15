const path = require('path');
const fs = require('fs');
const multer = require('multer');

// Define upload directory
const uploadDir = path.join(__dirname, '..', 'uploads');

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Use memory storage to process image in memory before saving
const storage = multer.memoryStorage();

// File filter (JPG, JPEG, PNG, WEBP)
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error('Only JPG, JPEG, PNG, and WEBP image files are allowed.'));
    }
};

// Limit file size to 15MB
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 15 * 1024 * 1024 } // 15MB
}).single('image');

exports.uploadImage = (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }
        if (!req.file) {
            return res.status(400).json({ message: 'Please select an image file to upload.' });
        }

        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const originalExt = path.extname(req.file.originalname).toLowerCase();
        const filename = `${uniqueSuffix}${originalExt}`;
        const outputPath = path.join(uploadDir, filename);

        try {
            // Try importing sharp dynamically
            let sharp;
            try {
                sharp = require('sharp');
            } catch (sharpLoadErr) {
                console.warn('Sharp could not be loaded, falling back to uncompressed storage:', sharpLoadErr.message);
            }

            if (sharp) {
                let sharpInstance = sharp(req.file.buffer);

                // Compress based on file extension
                if (originalExt === '.png') {
                    sharpInstance = sharpInstance.png({ quality: 80, compressionLevel: 9 });
                } else if (originalExt === '.webp') {
                    sharpInstance = sharpInstance.webp({ quality: 80 });
                } else {
                    // For jpeg/jpg or anything else
                    sharpInstance = sharpInstance.jpeg({ quality: 85, mozjpeg: true });
                }

                // Also resize large images to a maximum width/height of 1600px to avoid huge resolutions
                // but only if they are larger than that
                sharpInstance = sharpInstance.resize({
                    width: 1600,
                    height: 1600,
                    fit: 'inside',
                    withoutEnlargement: true
                });

                await sharpInstance.toFile(outputPath);
                console.log(`Image compressed and saved: ${filename}`);
            } else {
                // Fallback to writing original file as-is
                fs.writeFileSync(outputPath, req.file.buffer);
                console.log(`Image saved (uncompressed fallback): ${filename}`);
            }

            // Return the relative URL of the uploaded image
            const fileUrl = `/uploads/${filename}`;
            res.json({ url: fileUrl });

        } catch (processErr) {
            console.error('Error processing uploaded image:', processErr);
            // If sharp fails for some reason, try to write original file as a final fallback
            try {
                fs.writeFileSync(outputPath, req.file.buffer);
                const fileUrl = `/uploads/${filename}`;
                return res.json({ url: fileUrl });
            } catch (fallbackErr) {
                return res.status(500).json({ message: 'Error saving uploaded image: ' + fallbackErr.message });
            }
        }
    });
};
