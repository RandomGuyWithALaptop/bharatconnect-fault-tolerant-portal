async function runStressTest() {
    const totalRequests = 1000; // Total simulated users
    const promises = [];
    const BACKEND_URL = 'http://localhost:5000'; // Your active Express port

    console.time("StressTestDuration");
    console.log(`🚀 Launching ${totalRequests} simultaneous network requests to Express backend...`);

    for (let i = 0; i < totalRequests; i++) {
        // Fire actual network requests concurrently to your live endpoint
        promises.push(
            fetch(`${BACKEND_URL}/api/recharge`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mobile: `user_${i}` })
            })
            .then(res => ({ success: res.status === 200 }))
            .catch(() => ({ success: false })) // Catch dropped/timeout sockets securely
        );
    }

    // Fire them all concurrently
    const results = await Promise.allSettled(promises);
    console.timeEnd("StressTestDuration");

    // Analyze the results cleanly
    const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
    const failed = results.filter(r => r.status === 'rejected' || (r.value && !r.value.success)).length;

    console.log(`\n📊 Results against 60% Downstream Fault Layer:`);
    console.log(`✅ Successful Recharges: ${successful}`);
    console.log(`❌ Failed/Dropped Recharges: ${failed}`);
}

runStressTest();