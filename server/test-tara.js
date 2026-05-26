// For development: bypass SSL verification
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

require('dotenv').config({ path: require('path').join(__dirname, '.env') });

const { streamChatResponseWordByWord } = require('./chatbot');

async function testTara() {
    console.log('\n🧭 Testing Tara...\n');
    
    const testMessage = 'I want an adventure trip in the mountains, kuch suggest karo!';
    const history = [];

    console.log(`📝 User: ${testMessage}\n`);
    console.log('💬 Tara: ');

    try {
        await streamChatResponseWordByWord(
            testMessage,
            history,
            (chunk) => {
                process.stdout.write(chunk.chunk);
            }
        );

        console.log('\n\n✅ Stream complete — Tara ne plan bana diya!\n');
    } catch (error) {
        console.error('\n❌ Error:', error.message);
        process.exit(1);
    }
}

testTara();
