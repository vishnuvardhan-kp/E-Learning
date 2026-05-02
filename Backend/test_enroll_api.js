async function testEnroll() {
    try {
        const res = await fetch('http://127.0.0.1:5000/enroll', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ studentId: '69f5af2dc7e85a4ad6f8988d', courseId: '69f5b8b9c7e85a4ad6f8988f' })
        });
        const data = await res.json();
        console.log("Enrollment Response:", data);
    } catch (e) {
        console.error("Enrollment Error:", e);
    }
}

testEnroll();
