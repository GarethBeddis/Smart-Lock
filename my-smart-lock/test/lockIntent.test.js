const { App, Util } = require('jovo-framework');
const { GoogleAssistant } = require('jovo-platform-googleassistant');
const { Alexa } = require('jovo-platform-alexa');
jest.setTimeout(500);

for (const p of [new Alexa(), new GoogleAssistant()]) {
    const testSuite = p.makeTestSuite();

    describe(`PLATFORM: ${p.constructor.name} INTENTS` , () => {
        test('should return LOCKED status at "LockIntent"', async () => {
            const conversation = testSuite.conversation();

            const lockRequest = await testSuite.requestBuilder.intent('LockIntent', {lockStatus: 'lock'});
            const responseLockRequest = await conversation.send(lockRequest);
            expect(
                responseLockRequest.isAsk(expectedLockPrompt)
            ).toBe(true);

        });

        test('should return UNLOCKED status at "LockIntent"', async () => {
            const conversation = testSuite.conversation();

            const lockRequest = await testSuite.requestBuilder.intent('LockIntent', {lockStatus: 'unlocked'});
            const responseLockRequest = await conversation.send(lockRequest);
            expect(
                responseLaunchRequest.isAsk(expectedUnlockPrompt)
            ).toBe(true);

        });
    });
}

let expectedLockPrompt = `Your door is locked.`
let expectedUnloockPrompt = `Your door is unlocked.`