const mongoose = require("mongoose");
const Member = require("./models/Member");
const ClanHistory = require("./models/ClanHistory");
const MediaAlbum = require("./models/MediaAlbum");
const Event = require("./models/Event");
const User = require("./models/User");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    try {
      console.log("✓ MongoDB connected\n");
      
      const adminUser = await User.findOne({ role: "Super Admin" });
      if (!adminUser) {
        console.error("❌ Admin user not found. Please create an admin user first.");
        process.exit(1);
      }

      // Add Clan History
      console.log("Creating clan history...");
      const historyCount = await ClanHistory.countDocuments();
      if (historyCount === 0) {
        await ClanHistory.create([
          {
            title: "Founding of Haikambe Tsame Clan",
            year: 1920,
            category: "Origin",
            description: "Chief Haikambe Tsame established the clan in Omaruru, bringing together families under a unified leadership and cultural identity. This marked the beginning of organized clan governance and cultural preservation efforts.",
            content: "The founding of our clan represents a pivotal moment in our collective history, establishing the traditions and values that guide us today."
          },
          {
            title: "First Community School Founded",
            year: 1955,
            category: "Achievements",
            description: "The clan established its first community school, providing education to over 100 children from the local area. This initiative laid the foundation for the clan's commitment to education and empowerment.",
            content: "Education has always been a cornerstone of our clan's values, beginning with this historic school."
          },
          {
            title: "50th Anniversary Celebration",
            year: 1970,
            category: "Traditions",
            description: "Grand celebration marking 50 years of clan unity, bringing together over 500 family members and community friends.  Strengthened family bonds and renewed commitment to cultural values.",
            content: "This celebration became an annual tradition, reinforcing our commitment to unity and cultural preservation."
          },
          {
            title: "Leadership Transition to Second Generation",
            year: 1985,
            category: "Leadership",
            description: "Peaceful transition of clan leadership to the second generation, maintaining continuity while embracing new perspectives.",
            content: "This transition demonstrated our clan's ability to evolve while honoring our traditions."
          },
          {
            title: "Digital Archive Launch",
            year: 2026,
            category: "Achievements",
            description: "Launch of the Haikambe Tsame digital clan management system and archive. Modernizing clan administration while preserving our heritage for the digital age.",
            content: "Embracing technology to ensure our stories and heritage are preserved for future generations."
          }
        ]);
        console.log(`✓ Created ${await ClanHistory.countDocuments()} history entries\n`);
      } else {
        console.log(`ℹ  Skipping - ${historyCount} history entries already exist\n`);
      }

      // Add Media Albums
      console.log("Creating media albums...");
      const albumCount = await MediaAlbum.countDocuments();
      if (albumCount === 0) {
        await MediaAlbum.create([
          {
            name: "Founding Anniversary 2020",
            description: "Centennial celebration of the clan's founding. A gathering of over 300 family members from across Namibia and abroad.",
            category: "Events",
            eventDate: new Date("2020-03-15"),
            location: "Omaruru, Erongo Region",
            uploadedBy: adminUser._id,
            items: [
              { type: "image", title: "Opening Ceremony", url: "/media/2020-anniversary/opening.jpg" },
              { type: "image", title: "Cultural Performances", url: "/media/2020-anniversary/culture.jpg" },
              { type: "image", title: "Family Gathering", url: "/media/2020-anniversary/family.jpg" },
              { type: "video", title: "Elder Speeches", url: "/media/2020-anniversary/speeches.mp4" }
            ]
          },
          {
            name: "Family Portraits Collection",
            description: "Professional portraits of clan members across generations.",
            category: "Portraits",
            uploadedBy: adminUser._id,
            items: [
              { type: "image", title: "Generation 1", url: "/media/portraits/gen1.jpg" },
              { type: "image", title: "Generation 2", url: "/media/portraits/gen2.jpg" },
              { type: "image", title: "Generation 3", url: "/media/portraits/gen3.jpg" }
            ]
          },
          {
            name: "Historical Archives (1920-1960)",
            description: "Rare photographs and documents from the early years of the clan.",
            category: "Historical",
            uploadedBy: adminUser._id,
            items: [
              { type: "image", title: "Original Settlement", url: "/media/historical/settlement.jpg" },
              { type: "image", title: "First School Building", url: "/media/historical/school.jpg" }
            ]
          }
        ]);
        console.log(`✓ Created ${await MediaAlbum.countDocuments()} media albums\n`);
      } else {
        console.log(`ℹ  Skipping - ${albumCount} albums already exist\n`);
      }

      // Add Events
      console.log("Creating events...");
      const eventCount = await Event.countDocuments();
      if (eventCount === 0) {
        await Event.create([
          {
            title: "Annual Family Reunion 2026",
            description: "Our yearly gathering brings together clan members from across Namibia and abroad. Join us for cultural activities, traditional food, storytelling sessions, and reconnecting with family.",
            type: "Annual Gathering",
            eventDate: new Date("2026-12-15"),
            location: "Windhoek",
            venue: "Safari Hotel Conference Center",
            organizers: [adminUser._id],
            status: "Planned"
          },
          {
            title: "Youth Leadership Workshop",
            description: "Empowering the next generation through leadership training, mentorship, and skills development.",
            type: "Meeting",
            eventDate: new Date("2026-04-20"),
            location: "Swakopmund",
            venue: "Hansa Hotel Conference Room",
            organizers: [adminUser._id],
            status: "Planned"
          },
          {
            title: "Cultural Heritage Day",
            description: "Celebrating our traditions through music, dance, traditional dress, and storytelling.",
            type: "Ceremony",
            eventDate: new Date("2026-08-10"),
            location: "Omaruru",
            venue: "Community Cultural Center",
            organizers: [adminUser._id],
            status: "Planned"
          },
          {
            title: "New Year Celebration 2025",
            description: "Celebrated the arrival of 2025 with traditional festivities, music, and family bonding.",
            type: "Annual Gathering",
            eventDate: new Date("2025-01-01"),
            location: "Windhoek",
            venue: "Safari Court Hotel",
            organizers: [adminUser._id],
            status: "Completed"
          }
        ]);
        console.log(`✓ Created ${await Event.countDocuments()} events\n`);
      } else {
        console.log(`ℹ  Skipping - ${eventCount} events already exist\n`);
      }

      console.log("\n🎉 Database populated successfully!\n");
      console.log("Current counts:");
      console.log(`- Members: ${await Member.countDocuments()}`);
      console.log(`- History Entries: ${await ClanHistory.countDocuments()}`);
      console.log(`- Media Albums: ${await MediaAlbum.countDocuments()}`);
      console.log(`- Events: ${await Event.countDocuments()}`);
      
      process.exit(0);
    } catch (error) {
      console.error("❌ Error:", error.message);
      console.error(error);
      process.exit(1);
    }
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });
