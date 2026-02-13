const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// Import models
const User = require("./models/User");
const Member = require("./models/Member");
const NewbornRequest = require("./models/NewbornRequest");
const ClanHistory = require("./models/ClanHistory");
const MediaAlbum = require("./models/MediaAlbum");
const Event = require("./models/Event");

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✓ MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const seedData = async () => {
  try {
    console.log("🌱 Starting database seeding...\n");

    // Clear existing data (optional - comment out if you want to keep existing data)
    // await Member.deleteMany({});
    // await NewbornRequest.deleteMany({});
    // await ClanHistory.deleteMany({});
    // await MediaAlbum.deleteMany({});
    // await Event.deleteMany({});
    // console.log("✓ Cleared existing data\n");

    // Check existing data
    const existingMembers = await Member.countDocuments();
    console.log(`ℹ  Found ${existingMembers} existing members\n`);

    // Create Members with family relationships
    console.log("Creating members...");
    
    // Generation 1 - Founders
    const founder1 = await Member.create({
      fullName: "Chief Haikambe Tsame",
      gender: "Male",
      dateOfBirth: new Date("1920-03-15"),
      dateOfDeath: new Date("2005-08-22"),
      status: "Deceased",
      occupation: "Tribal Chief",
      residence: "Omaruru, Erongo Region",
      contactNumber: "+264 64 570123",
      email: "legacy@haikambe.na",
      biography: "Founding patriarch of the Haikambe Tsame clan. Led the community through challenging times and established lasting traditions that guide us today.",
      generation: 1,
      achievements: ["Established clan governance structure", "Led community development initiatives", "Preserved cultural heritage"]
    });

    const founder2 = await Member.create({
      fullName: "Kauna Haikambe",
      gender: "Female",
      dateOfBirth: new Date("1925-07-10"),
      dateOfDeath: new Date("2010-12-05"),
      status: "Deceased",
      occupation: "Community Leader",
      residence: "Omaruru, Erongo Region",
      biography: "Matriarch and spiritual guide of the clan. Known for her wisdom and dedication to preserving traditional knowledge.",
      generation: 1,
      spouse: founder1._id,
      achievements: ["Established women's cooperative", "Cultural preservation advocate"]
    });

    // Update founder1 with spouse
    await Member.findByIdAndUpdate(founder1._id, { spouse: founder2._id });

    // Generation 2 - Children
    const gen2_1 = await Member.create({
      fullName: "Johannes Haikambe",
      gender: "Male",
      dateOfBirth: new Date("1948-02-20"),
      dateOfDeath: new Date("2015-06-14"),
      status: "Deceased",
      occupation: "Educator",
      residence: "Windhoek, Khomas Region",
      contactNumber: "+264 61 234567",
      email: "johannes.h@legacy.na",
      biography: "First family member to receive university education. Dedicated his life to teaching.",
      generation: 2,
      father: founder1._id,
      mother: founder2._id
    });

    const gen2_1_spouse = await Member.create({
      fullName: "Maria Haikambe",
      gender: "Female",
      dateOfBirth: new Date("1950-11-08"),
      status: "Living",
      occupation: "Nurse",
      residence: "Windhoek, Khomas Region",
      contactNumber: "+264 61 234568",
      email: "maria.h@gmail.com",
      biography: "Healthcare professional who served communities across Namibia for 40 years.",
      generation: 2,
      spouse: gen2_1._id
    });

    await Member.findByIdAndUpdate(gen2_1._id, { spouse: gen2_1_spouse._id });

    const gen2_2 = await Member.create({
      fullName: "Elizabeth Katjimune",
      gender: "Female",
      dateOfBirth: new Date("1952-05-30"),
      status: "Living",
      occupation: "Business Owner",
      residence: "Swakopmund, Erongo Region",
      contactNumber: "+264 64 402345",
      email: "elizabeth.k@business.na",
      biography: "Successful entrepreneur and philanthropist. Supports education initiatives in rural areas.",
      generation: 2,
      father: founder1._id,
      mother: founder2._id
    });

    const gen2_3 = await Member.create({
      fullName: "Samuel Haikambe",
      gender: "Male",
      dateOfBirth: new Date("1955-09-12"),
      status: "Living",
      occupation: "Agricultural Expert",
      residence: "Otjiwarongo, Otjozondjupa Region",
      contactNumber: "+264 67 303456",
      email: "samuel.h@agri.na",
      biography: "Pioneer in sustainable farming practices. Trains young farmers in modern agricultural techniques.",
      generation: 2,
      father: founder1._id,
      mother: founder2._id
    });

    // Generation 3 - Grandchildren
    const gen3_1 = await Member.create({
      fullName: "David Haikambe",
      gender: "Male",
      dateOfBirth: new Date("1975-03-18"),
      status: "Living",
      occupation: "Software Engineer",
      residence: "Windhoek, Khomas Region",
      contactNumber: "+264 81 123 4567",
      email: "david.haikambe@tech.na",
      biography: "IT professional working in fintech. Passionate about using technology to solve African challenges.",
      generation: 3,
      father: gen2_1._id,
      mother: gen2_1_spouse._id
    });

    const gen3_2 = await Member.create({
      fullName: "Sarah Haikambe",
      gender: "Female",
      dateOfBirth: new Date("1978-08-25"),
      status: "Living",
      occupation: "Medical Doctor",
      residence: "Windhoek, Khomas Region",
      contactNumber: "+264 81 234 5678",
      email: "dr.sarah.h@hospital.na",
      biography: "Pediatrician at Windhoek Central Hospital. Advocate for child healthcare accessibility.",
      generation: 3,
      father: gen2_1._id,
      mother: gen2_1_spouse._id
    });

    const gen3_3 = await Member.create({
      fullName: "Michael Katjimune",
      gender: "Male",
      dateOfBirth: new Date("1980-01-10"),
      status: "Living",
      occupation: "Architect",
      residence: "Swakopmund, Erongo Region",
      contactNumber: "+264 81 345 6789",
      email: "michael.k@design.na",
      biography: "Award-winning architect specializing in sustainable urban design.",
      generation: 3,
      mother: gen2_2._id
    });

    const gen3_4 = await Member.create({
      fullName: "Grace Haikambe",
      gender: "Female",
      dateOfBirth: new Date("1982-06-22"),
      status: "Living",
      occupation: "Lawyer",
      residence: "Windhoek, Khomas Region",
      contactNumber: "+264 81 456 7890",
      email: "grace.h@legal.na",
      biography: "Human rights lawyer focusing on land rights and indigenous peoples' issues.",
      generation: 3,
      father: gen2_3._id
    });

    const gen3_5 = await Member.create({
      fullName: "Joseph Haikambe",
      gender: "Male",
      dateOfBirth: new Date("1985-11-05"),
      status: "Living",
      occupation: "Environmental Scientist",
      residence: "Otjiwarongo, Otjozondjupa Region",
      contactNumber: "+264 81 567 8901",
      email: "joseph.h@environ.na",
      biography: "Researcher working on wildlife conservation and climate change adaptation.",
      generation: 3,
      father: gen2_3._id
    });

    // Generation 4 - Great-grandchildren
    const gen4_1 = await Member.create({
      fullName: "Daniel Haikambe",
      gender: "Male",
      dateOfBirth: new Date("2000-04-12"),
      status: "Living",
      occupation: "University Student",
      residence: "Windhoek, Khomas Region",
      contactNumber: "+264 81 678 9012",
      email: "daniel.h@unam.na",
      biography: "Computer Science student at UNAM. Interested in artificial intelligence and machine learning.",
      generation: 4,
      father: gen3_1._id
    });

    const gen4_2 = await Member.create({
      fullName: "Ruth Haikambe",
      gender: "Female",
      dateOfBirth: new Date("2002-09-08"),
      status: "Living",
      occupation: "Medical Student",
      residence: "Windhoek, Khomas Region",
      contactNumber: "+264 81 789 0123",
      email: "ruth.h@unam.na",
      biography: "Following in her mother's footsteps, studying medicine with focus on pediatrics.",
      generation: 4,
      mother: gen3_2._id
    });

    const gen4_3 = await Member.create({
      fullName: "Peter Katjimune",
      gender: "Male",
      dateOfBirth: new Date("2005-02-14"),
      status: "Living",
      occupation: "High School Student",
      residence: "Swakopmund, Erongo Region",
      contactNumber: "+264 81 890 1234",
      email: "peter.k@school.na",
      biography: "Talented artist and athlete. Aspires to study architecture like his father.",
      generation: 4,
      father: gen3_3._id
    });

    const gen4_4 = await Member.create({
      fullName: "Emma Haikambe",
      gender: "Female",
      dateOfBirth: new Date("2008-07-20"),
      status: "Living",
      occupation: "High School Student",
      residence: "Windhoek, Khomas Region",
      contactNumber: "+264 81 901 2345",
      email: "emma.h@school.na",
      biography: "Passionate about environmental conservation and social justice.",
      generation: 4,
      mother: gen3_4._id
    });

    const gen4_5 = await Member.create({
      fullName: "Luke Haikambe",
      gender: "Male",
      dateOfBirth: new Date("2010-12-03"),
      status: "Living",
      occupation: "Junior School Student",
      residence: "Otjiwarongo, Otjozondjupa Region",
      contactNumber: "+264 81 012 3456",
      email: "luke.h@school.na",
      biography: "Young nature enthusiast who loves wildlife and outdoor activities.",
      generation: 4,
      father: gen3_5._id
    });

    console.log(`✓ Created ${await Member.countDocuments()} members\n`);

    // Create Newborn Requests
    console.log("Creating newborn requests...");
    
    // Get the admin user for createdBy field
    const adminUser = await User.findOne({ role: "Super Admin" });
    
    // Need to add spouse members first for complete parent info
    const gen3_1_wife = await Member.create({
      fullName: "Linda Haikambe",
      gender: "Female",
      dateOfBirth: new Date("1977-06-15"),
      status: "Living",
      occupation: "Marketing Manager",
      residence: "Windhoek, Khomas Region",
      contactNumber: "+264 81 234 0001",
      email: "linda.h@marketing.na",
      generation: 3,
      spouse: gen3_1._id
    });
    
    const gen3_3_wife = await Member.create({
      fullName: "Anna Katjimune",
      gender: "Female",
      dateOfBirth: new Date("1982-08-20"),
      status: "Living",
      occupation: "Interior Designer",
      residence: "Swakopmund, Erongo Region",
      contactNumber: "+264 81 345 0002",
      email: "anna.k@design.na",
      generation: 3,
      spouse: gen3_3._id
    });
    
    const gen3_2_husband = await Member.create({
      fullName: "Thomas Uirab",
      gender: "Male",
      dateOfBirth: new Date("1976-04-10"),
      status: "Living",
      occupation: "Surgeon",
      residence: "Windhoek, Khomas Region",
      contactNumber: "+264 81 234 0003",
      email: "thomas.u@hospital.na",
      generation: 3,
      spouse: gen3_2._id
    });
    
    await NewbornRequest.create([
      {
        fullName: "Anna Haikambe",
        gender: "Female",
        dateOfBirth: new Date("2024-11-15"),
        placeOfBirth: "Windhoek Central Hospital",
        father: gen3_1._id,
        mother: gen3_1_wife._id,
        createdBy: adminUser._id,
        status: "Pending"
      },
      {
        fullName: "Benjamin Katjimune",
        gender: "Male",
        dateOfBirth: new Date("2024-12-20"),
        placeOfBirth: "Swakopmund State Hospital",
        father: gen3_3._id,
        mother: gen3_3_wife._id,
        createdBy: adminUser._id,
        status: "Pending"
      },
      {
        fullName: "Sophia Uirab",
        gender: "Female",
        dateOfBirth: new Date("2023-08-10"),
        placeOfBirth: "Windhoek Central Hospital",
        father: gen3_2_husband._id,
        mother: gen3_2._id,
        createdBy: adminUser._id,
        status: "Approved",
        reviewedBy: adminUser._id,
        reviewedAt: new Date("2023-09-01"),
        reviewNotes: "All documents verified and approved."
      }
    ]);

    console.log(`✓ Created ${await NewbornRequest.countDocuments()} newborn requests\n`);

    // Create Clan History entries
    console.log("Creating clan history...");
    
    await ClanHistory.create([
      {
        title: "Founding of Haikambe Tsame Clan",
        year: 1920,
        category: "Establishment",
        description: "Chief Haikambe Tsame established the clan in Omaruru, bringing together families under a unified leadership and cultural identity.",
        significance: "This marked the beginning of organized clan governance and cultural preservation efforts.",
        involvedMembers: [founder1._id],
        location: "Omaruru, Erongo Region"
      },
      {
        title: "First Community School Founded",
        year: 1955,
        category: "Education",
        description: "The clan established its first community school, providing education to over 100 children from the local area.",
        significance: "This initiative laid the foundation for the clan's commitment to education and empowerment.",
        location: "Omaruru, Erongo Region"
      },
      {
        title: "Women's Cooperative Establishment",
        year: 1965,
        category: "Economic",
        description: "Kauna Haikambe led the creation of a women's cooperative focused on traditional crafts and agriculture.",
        significance: "Empowered women economically and preserved traditional craftsmanship.",
        involvedMembers: [founder2._id],
        location: "Omaruru, Erongo Region"
      },
      {
        title: "First University Graduate",
        year: 1972,
        category: "Education",
        description: "Johannes Haikambe became the first clan member to graduate from university with a degree in Education.",
        significance: "Opened doors for higher education pursuit among clan members.",
        involvedMembers: [gen2_1._id],
        location: "Windhoek, Khomas Region"
      },
      {
        title: "50th Anniversary Celebration",
        year: 1970,
        category: "Celebration",
        description: "Grand celebration marking 50 years of clan unity, bringing together over 500 family members and community friends.",
        significance: "Strengthened family bonds and renewed commitment to cultural values.",
        location: "Omaruru, Erongo Region"
      },
      {
        title: "Preservation of Oral Histories Project",
        year: 1995,
        category: "Cultural",
        description: "Initiative launched to record and preserve oral histories, traditional songs, and cultural practices from elders.",
        significance: "Ensured cultural knowledge is passed to future generations.",
        location: "Multiple locations"
      },
      {
        title: "Digital Archive Launch",
        year: 2026,
        category: "Technology",
        description: "Launch of the Haikambe Tsame digital clan management system and archive.",
        significance: "Modernizing clan administration while preserving our heritage for the digital age.",
        location: "Online Platform"
      }
    ]);

    console.log(`✓ Created ${await ClanHistory.countDocuments()} history entries\n`);

    // Create Media Albums
    console.log("Creating media albums...");
    
    await MediaAlbum.create([
      {
        name: "Founding Anniversary 2020",
        description: "Centennial celebration of the clan's founding. A gathering of over 300 family members from across Namibia and abroad.",
        category: "Events",
        eventDate: new Date("2020-03-15"),
        location: "Omaruru, Erongo Region",
        uploadedBy: await User.findOne({ role: "Super Admin" }).then(u => u?._id),
        items: [
          { type: "image", title: "Opening Ceremony", url: "/media/2020-anniversary/opening.jpg" },
          { type: "image", title: "Cultural Performances", url: "/media/2020-anniversary/culture.jpg" },
          { type: "image", title: "Family Gathering", url: "/media/2020-anniversary/family.jpg" },
          { type: "video", title: "Elder Speeches", url: "/media/2020-anniversary/speeches.mp4" },
          { type: "image", title: "Traditional Feast", url: "/media/2020-anniversary/feast.jpg" }
        ]
      },
      {
        name: "Traditional Wedding Ceremony 2022",
        description: "Beautiful traditional wedding ceremony uniting two families in the Herero tradition.",
        category: "Ceremonies",
        eventDate: new Date("2022-06-18"),
        location: "Swakopmund, Erongo Region",
        uploadedBy: await User.findOne({ role: "Super Admin" }).then(u => u?._id),
        items: [
          { type: "image", title: "Bridal Procession", url: "/media/wedding-2022/procession.jpg" },
          { type: "image", title: "Traditional Attire", url: "/media/wedding-2022/attire.jpg" },
          { type: "video", title: "Ceremony Highlights", url: "/media/wedding-2022/ceremony.mp4" },
          { type: "image", title: "Reception", url: "/media/wedding-2022/reception.jpg" }
        ]
      },
      {
        name: "Family Portraits Collection",
        description: "Professional portraits of clan members across generations.",
        category: "Portraits",
        uploadedBy: await User.findOne({ role: "Super Admin" }).then(u => u?._id),
        items: [
          { type: "image", title: "Chief Haikambe Tsame", url: "/media/portraits/chief.jpg" },
          { type: "image", title: "Kauna Haikambe", url: "/media/portraits/kauna.jpg" },
          { type: "image", title: "Generation 2 Group", url: "/media/portraits/gen2.jpg" },
          { type: "image", title: "Generation 3 Group", url: "/media/portraits/gen3.jpg" }
        ]
      },
      {
        name: "Historical Archives (1920-1960)",
        description: "Rare photographs and documents from the early years of the clan.",
        category: "Historical",
        uploadedBy: await User.findOne({ role: "Super Admin" }).then(u => u?._id),
        items: [
          { type: "image", title: "Original Settlement", url: "/media/historical/settlement.jpg" },
          { type: "image", title: "First School Building", url: "/media/historical/school.jpg" },
          { type: "image", title: "Community Gathering 1950s", url: "/media/historical/gathering.jpg" }
        ]
      },
      {
        name: "Annual Reunion 2025",
        description: "Most recent annual family reunion with cultural activities and youth programs.",
        category: "Gatherings",
        eventDate: new Date("2025-12-20"),
        location: "Windhoek, Khomas Region",
        uploadedBy: await User.findOne({ role: "Super Admin" }).then(u => u?._id),
        items: [
          { type: "image", title: "Welcome Reception", url: "/media/reunion-2025/welcome.jpg" },
          { type: "image", title: "Youth Activities", url: "/media/reunion-2025/youth.jpg" },
          { type: "video", title: "Cultural Performances", url: "/media/reunion-2025/performances.mp4" },
          { type: "image", title: "Group Photo", url: "/media/reunion-2025/group.jpg" }
        ]
      }
    ]);

    console.log(`✓ Created ${await MediaAlbum.countDocuments()} media albums\n`);

    // Create Events
    console.log("Creating events...");
    
    const adminUser = await User.findOne({ role: "Super Admin" });
    
    await Event.create([
      {
        title: "Annual Family Reunion 2026",
        description: "Our yearly gathering brings together clan members from across Namibia and abroad. Join us for cultural activities, traditional food, storytelling sessions, and reconnecting with family.",
        type: "Reunion",
        eventDate: new Date("2026-12-15"),
        location: "Windhoek",
        venue: "Safari Hotel Conference Center",
        organizer: adminUser?._id,
        attendees: [gen3_1._id, gen3_2._id, gen3_4._id, gen4_1._id, gen4_2._id],
        status: "Planned",
        expectedAttendees: 250
      },
      {
        title: "Youth Leadership Workshop",
        description: "Empowering the next generation through leadership training, mentorship, and skills development. Focus on entrepreneurship, technology, and cultural preservation.",
        type: "Workshop",
        eventDate: new Date("2026-04-20"),
        location: "Swakopmund",
        venue: "Hansa Hotel Conference Room",
        organizer: gen3_1._id,
        attendees: [gen4_1._id, gen4_2._id, gen4_3._id, gen4_4._id],
        status: "Planned",
        expectedAttendees: 50
      },
      {
        title: "Cultural Heritage Day",
        description: "Celebrating our traditions through music, dance, traditional dress, and storytelling. Elders will share wisdom and cultural knowledge with younger generations.",
        type: "Cultural",
        eventDate: new Date("2026-08-10"),
        location: "Omaruru",
        venue: "Community Cultural Center",
        organizer: gen2_2._id,
        attendees: [gen2_3._id, gen3_3._id, gen3_5._id],
        status: "Planned",
        expectedAttendees: 180
      },
      {
        title: "Founders' Memorial Service",
        description: "Honoring the memory of our founding patriarch and matriarch. A solemn ceremony of remembrance, gratitude, and renewal of our commitment to their legacy.",
        type: "Memorial",
        eventDate: new Date("2026-03-15"),
        location: "Omaruru",
        venue: "Haikambe Memorial Garden",
        organizer: gen2_1_spouse._id,
        attendees: [gen2_2._id, gen2_3._id, gen3_1._id, gen3_2._id, gen3_4._id, gen3_5._id],
        status: "Planned",
        expectedAttendees: 200
      },
      {
        title: "Education Fund Gala Dinner",
        description: "Fundraising event to support educational initiatives for clan youth. Evening includes dinner, entertainment, and recognition of academic achievers.",
        type: "Fundraiser",
        eventDate: new Date("2026-10-05"),
        location: "Windhoek",
        venue: "Hilton Windhoek Ballroom",
        organizer: gen3_4._id,
        attendees: [gen3_1._id, gen3_2._id, gen3_3._id],
        status: "Planned",
        expectedAttendees: 120
      },
      {
        title: "New Year Celebration 2025",
        description: "Celebrated the arrival of 2025 with traditional festivities, music, and family bonding.",
        type: "Celebration",
        eventDate: new Date("2025-01-01"),
        location: "Windhoek",
        venue: "Safari Court Hotel",
        organizer: adminUser?._id,
        attendees: [gen3_1._id, gen3_2._id, gen3_3._id, gen3_4._id, gen3_5._id, gen4_1._id, gen4_2._id],
        status: "Completed",
        expectedAttendees: 150
      }
    ]);

    console.log(`✓ Created ${await Event.countDocuments()} events\n`);

    console.log("🎉 Database seeding completed successfully!\n");
    console.log("Summary:");
    console.log(`- Members: ${await Member.countDocuments()}`);
    console.log(`- Newborn Requests: ${await NewbornRequest.countDocuments()}`);
    console.log(`- History Entries: ${await ClanHistory.countDocuments()}`);
    console.log(`- Media Albums: ${await MediaAlbum.countDocuments()}`);
    console.log(`- Events: ${await Event.countDocuments()}`);
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

seedData();
