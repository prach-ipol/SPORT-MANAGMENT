const AUTO_BASE_URL = 'http://localhost:4002'; // Adjust if server runs on different port

async function runTest() {
    try {
        console.log('Starting test...');

        // 1. Create a manager
        const managerEmail = `test.manager.${Date.now()}@example.com`;
        console.log(`Creating manager with email: ${managerEmail}`);

        let manager;
        try {
            const createManagerRes = await fetch(`${AUTO_BASE_URL}/api/managers`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: 'Test Manager',
                    department: 'IT',
                    sport: 'Cricket',
                    contact: '1234567890',
                    email: managerEmail,
                    studentCount: 10
                })
            });
            const data = await createManagerRes.json();
            if (!createManagerRes.ok) throw new Error(data.error);
            manager = data.manager;
            console.log('Manager created:', manager.id);
        } catch (e) {
            console.error('Failed to create manager:', e.message);
            return;
        }

        // 2. Create a student link
        console.log('Creating student link...');
        const createLinkRes = await fetch(`${AUTO_BASE_URL}/api/student-links`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                managerId: manager.id
            })
        });
        const linkData = await createLinkRes.json();
        const link = linkData.link;
        console.log('Link created, token:', link.token);

        // 3. Submit a student with size
        console.log('Submitting student form with size 42...');
        const prn = `PRN${Date.now()}`;
        const submitRes = await fetch(`${AUTO_BASE_URL}/api/student-links/submit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                token: link.token,
                name: 'Test Student',
                prn_uid: prn,
                contact: '9876543210',
                email: `student.${Date.now()}@example.com`,
                address: 'Test Address',
                birthDate: '2000-01-01',
                size: 42
            })
        });
        const submitData = await submitRes.json();

        if (submitRes.ok) {
            console.log('Student submitted successfully.');
        } else {
            console.error('Student submission failed:', submitData);
        }

        // 4. Fetch students with selections
        console.log('Fetching students with selections...');
        const fetchRes = await fetch(`${AUTO_BASE_URL}/api/students-with-selections?managerId=${manager.id}`);
        const students = await fetchRes.json();

        const submittedStudent = students.find(s => s.prn_uid === prn);

        if (submittedStudent) {
            console.log('Found student:', submittedStudent.name);
            console.log('Student size:', submittedStudent.size);

            if (Number(submittedStudent.size) === 42) {
                console.log('SUCCESS: Size is correctly saved and retrieved.');
            } else {
                console.log('FAILURE: Size is mismatch or missing.');
            }
        } else {
            console.log('FAILURE: Student not found in list.');
        }

    } catch (error) {
        console.error('Test failed with error:', error);
    }
}

runTest();
