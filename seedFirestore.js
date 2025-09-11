// seedFirestore.js - Script untuk membuat data awal di Firestore
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const seedData = {
  portfolio_projects: [
    {
      title: "E-commerce Platform",
      description: "Full-stack e-commerce platform dengan React dan Node.js",
      category: "Web Development",
      status: "Published",
      technologies: ["React", "Node.js", "MongoDB", "Stripe"],
      imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400",
      liveUrl: "https://example.com",
      githubUrl: "https://github.com/example/project",
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    },
    {
      title: "Mobile Banking App",
      description: "Aplikasi mobile banking dengan autentikasi biometrik",
      category: "Mobile App",
      status: "Published",
      technologies: ["React Native", "Firebase", "TypeScript"],
      imageUrl: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400",
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    }
  ],

  portfolio_skills: [
    {
      name: "React",
      category: "Frontend",
      level: "Expert",
      percentage: 95,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    },
    {
      name: "Node.js",
      category: "Backend",
      level: "Advanced",
      percentage: 85,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    },
    {
      name: "TypeScript",
      category: "Programming Language",
      level: "Advanced",
      percentage: 90,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    }
  ],

  portfolio_what_i_do: [
    {
      title: "Web Development",
      description: "Creating responsive websites using various available technologies",
      icon: "Code",
      iconColor: "text-blue-500",
      backgroundColor: "bg-red-50",
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    },
    {
      title: "UI/UX Design",
      description: "Designing interfaces for web and mobile applications",
      icon: "Palette",
      iconColor: "text-red-500",
      backgroundColor: "bg-blue-50",
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    }
  ],

  portfolio_experiences: [
    {
      title: "Frontend Developer",
      company: "Tech Solutions Inc.",
      period: "2023 - Present",
      location: "Semarang, Indonesia",
      description: "Developing responsive web applications using React.js and modern frontend technologies.",
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    }
  ],

  portfolio_educations: [
    {
      degree: "Bachelor of Computer Science",
      institution: "STMIK MARDIRA INDONESIA",
      period: "2021 - 2025",
      location: "Bandung, Indonesia",
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    }
  ]
};

async function seedFirestore() {
  console.log('🌱 Starting Firestore seeding...');

  try {
    // Seed each collection
    for (const [collectionName, documents] of Object.entries(seedData)) {
      console.log(`📝 Seeding ${collectionName}...`);
      
      for (const doc of documents) {
        await db.collection(collectionName).add(doc);
      }
      
      console.log(`✅ ${collectionName} seeded with ${documents.length} documents`);
    }

    // Create profile document
    console.log('📝 Creating profile document...');
    await db.collection('portfolio_profile').doc('main').set({
      name: 'Mohammad Zakaria Akbar Falah',
      title: 'Frontend Web Developer',
      email: 'Akbarflh013@gmail.com',
      phone: '+62852 1955 0092',
      location: 'Bandung, Indonesia',
      birthday: 'September 13, 2003',
      bio: 'Passionate frontend developer with expertise in React, TypeScript, and modern web technologies. I love creating beautiful and functional user interfaces.',
      imageUrl: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
      contactTitle: 'Get In Touch',
      contactMessage: "I'm always interested in new opportunities and exciting projects. Whether you want to hire me, collaborate, or just say hello, feel free to reach out!",
      cvUrl: 'https://drive.google.com/file/d/your-cv-file-id/view',
      socialMediaFields: [
        {
          id: '1',
          platform: 'GitHub',
          icon: 'github',
          url: 'https://github.com/yourusername',
          placeholder: 'https://github.com/yourusername'
        },
        {
          id: '2',
          platform: 'LinkedIn',
          icon: 'linkedin',
          url: 'https://linkedin.com/in/yourprofile',
          placeholder: 'https://linkedin.com/in/yourprofile'
        }
      ],
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Create knowledge document
    console.log('📝 Creating knowledge document...');
    await db.collection('portfolio_knowledge').doc('main').set({
      items: [
        'Javascript',
        'PHP',
        'Dart',
        'Next.js',
        'React.js',
        'Express.js',
        'Laravel',
        'Flutter',
        'Figma',
        'Photoshop'
      ],
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log('🎉 Firestore seeding completed successfully!');
    console.log('📊 Collections created:');
    console.log('   - portfolio_projects');
    console.log('   - portfolio_skills');
    console.log('   - portfolio_profile');
    console.log('   - portfolio_what_i_do');
    console.log('   - portfolio_knowledge');
    console.log('   - portfolio_experiences');
    console.log('   - portfolio_educations');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding Firestore:', error);
    process.exit(1);
  }
}

seedFirestore();
