export const counselorDemoData = [
    {
        name: 'Dr. Alex Stark',
        email: 'alex.stark@yopmail.com',
        password: 'Yahoo@123',
        role: 'counselor',
        country: 'India',
        counselorTitle: 'Specialist in Mental Health Counseling',
        counselorDescription:
            'Expert in providing mental health support and guidance.',
        profilePhoto: 'http://localhost:3000/uploads/default-profile.webp',
        isEmailVerified: true,
        specializations: getRandomSpecializations(),
    },
    {
        name: 'Dr. Jane Doe',
        email: 'jane.doe@yopmail.com',
        password: 'Yahoo@123',
        role: 'counselor',
        country: 'India',
        counselorTitle: 'Career Counseling Expert',
        counselorDescription:
            'Provides guidance on career paths and development.',
        profilePhoto: 'http://localhost:3000/uploads/default-profile.webp',
        isEmailVerified: true,
        specializations: getRandomSpecializations(),
    },
    {
        name: 'Dr. John Smith',
        email: 'john.smith@yopmail.com',
        password: 'Yahoo@123',
        role: 'counselor',
        country: 'India',
        counselorTitle: 'Relationship Counseling Specialist',
        counselorDescription:
            'Helps individuals and couples navigate relationship issues.',
        profilePhoto: 'http://localhost:3000/uploads/default-profile.webp',
        isEmailVerified: true,
        specializations: getRandomSpecializations(),
    },
    {
        name: 'Dr. Emily Brown',
        email: 'emily.brown@yopmail.com',
        password: 'Yahoo@123',
        role: 'counselor',
        country: 'India',
        counselorTitle: 'Substance Abuse Counseling Expert',
        counselorDescription:
            'Specializes in substance abuse recovery and support.',
        profilePhoto: 'http://localhost:3000/uploads/default-profile.webp',
        isEmailVerified: true,
        specializations: getRandomSpecializations(),
    },
    {
        name: 'Dr. Michael Johnson',
        email: 'michael.johnson@yopmail.com',
        password: 'Yahoo@123',
        role: 'counselor',
        country: 'India',
        counselorTitle: 'Financial Counseling Specialist',
        counselorDescription:
            'Assists individuals with financial planning and management.',
        profilePhoto: 'http://localhost:3000/uploads/default-profile.webp',
        isEmailVerified: true,
        specializations: getRandomSpecializations(),
    },
    {
        name: 'Dr. Sarah Lee',
        email: 'sarah.lee@yopmail.com',
        password: 'Yahoo@123',
        role: 'counselor',
        country: 'India',
        counselorTitle: 'Health and Wellness Counseling Expert',
        counselorDescription:
            'Promotes health and wellness through counseling.',
        profilePhoto: 'http://localhost:3000/uploads/default-profile.webp',
        isEmailVerified: true,
        specializations: getRandomSpecializations(),
    },
    {
        name: 'Dr. William Clark',
        email: 'william.clark@yopmail.com',
        password: 'Yahoo@123',
        role: 'counselor',
        country: 'India',
        counselorTitle: 'Marriage and Family Counseling Specialist',
        counselorDescription:
            'Provides counseling for marriage and family issues.',
        profilePhoto: 'http://localhost:3000/uploads/default-profile.webp',
        isEmailVerified: true,
        specializations: getRandomSpecializations(),
    },
    {
        name: 'Dr. Jessica Martinez',
        email: 'jessica.martinez@yopmail.com',
        password: 'Yahoo@123',
        role: 'counselor',
        country: 'India',
        counselorTitle: 'Workplace Counseling Expert',
        counselorDescription:
            'Helps individuals with workplace-related issues.',
        profilePhoto: 'http://localhost:3000/uploads/default-profile.webp',
        isEmailVerified: true,
        specializations: getRandomSpecializations(),
    },
    {
        name: 'Dr. Daniel White',
        email: 'daniel.white@yopmail.com',
        password: 'Yahoo@123',
        role: 'counselor',
        country: 'India',
        counselorTitle: 'Academic Counseling Specialist',
        counselorDescription:
            'Provides support for academic and educational concerns.',
        profilePhoto: 'http://localhost:3000/uploads/default-profile.webp',
        isEmailVerified: true,
        specializations: getRandomSpecializations(),
    },
    {
        name: 'Dr. Lisa Green',
        email: 'lisa.green@yopmail.com',
        password: 'Yahoo@123',
        role: 'counselor',
        country: 'India',
        counselorTitle: 'Personal Counseling Specialist',
        counselorDescription:
            'Offers personal counseling and support for various issues.',
        profilePhoto: 'http://localhost:3000/uploads/default-profile.webp',
        isEmailVerified: true,
        specializations: getRandomSpecializations(),
    },
];

function getRandomSpecializations() {
    const specializations = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const length = getRandomInt(3, 6);
    const selectedSpecializations = [];
    while (selectedSpecializations.length < length) {
        const randIndex = getRandomInt(0, specializations.length - 1);
        const spec = specializations[randIndex];
        if (!selectedSpecializations.includes(spec)) {
            selectedSpecializations.push(spec);
        }
    }
    return selectedSpecializations;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
