// A simple script to blast your internal service logic
const { RechargePortal } = require('./portalService'); 

async function runStressTest() {
    const totalRequests = 1000; // Total simulated users
    const promises = [];

    console.time("StressTestDuration");
    console.log(`🚀 Launching ${totalRequests} simultaneous recharge requests...`);

    for (let i = 0; i < totalRequests; i++) {
        // Simulating unique user transactions hitting your logic at once
        promises.push(RechargePortal.processRecharge(`user_${i}`, 500));
    }

    // Fire them all concurrently
    const results = await Promise.allSettled(promises);
    console.timeEnd("StressTestDuration");

    // Analyze the results
    const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
    const failed = results.filter(r => r.status === 'rejected' || (r.value && !r.value.success)).length;

    console.log(`\n📊 Results:`);
    console.log(`✅ Successful Recharges: ${successful}`);
    console.log(`❌ Failed/Dropped Recharges: ${failed}`);
}

runStressTest();