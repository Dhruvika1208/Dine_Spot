const fs = require('fs');
const readline = require('readline');

const transcriptPath = 'C:\\Users\\maddu\\.gemini\\antigravity-ide\\brain\\e9c47dee-be26-4e5f-ae0f-24662c10c842\\.system_generated\\logs\\transcript_full.jsonl';
const outPath = 'C:\\Users\\maddu\\.gemini\\antigravity-ide\\brain\\e9c47dee-be26-4e5f-ae0f-24662c10c842\\scratch\\recovered_step221.jsx';

async function extract() {
    const fileStream = fs.createReadStream(transcriptPath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    for await (const line of rl) {
        if (!line.trim()) continue;
        try {
            const obj = JSON.parse(line);
            if (obj.step_index === 221) {
                console.log(`Found step 221!`);
                if (obj.content) {
                    const codeLines = obj.content.split('\n');
                    const cleanCode = [];
                    let isCode = false;
                    for (const cl of codeLines) {
                        if (/^\s*\d+:/.test(cl)) {
                            const cleaned = cl.replace(/^\s*\d+: ?/, '');
                            cleanCode.push(cleaned.replace(/\r$/, ''));
                            isCode = true;
                        } else if (isCode) {
                            if (cl.includes('The above content') || cl.includes('File Path:')) {
                                break;
                            }
                        }
                    }
                    fs.writeFileSync(outPath, cleanCode.join('\n'), 'utf8');
                    console.log(`Step 221 extracted lines: ${cleanCode.length}`);
                    return;
                }
            }
        } catch (e) {
            console.error('Error:', e.message);
        }
    }
}

extract().catch(err => console.error(err));
