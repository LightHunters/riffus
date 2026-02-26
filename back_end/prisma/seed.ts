import { MembershipType, PrismaClient, SongSource, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const customer = await prisma.user.upsert({
    where: { id: "seed-customer" },
    update: {},
    create: {
      id: "seed-customer",
      name: "Guest",
      role: UserRole.customer,
      membershipType: MembershipType.Guest,
      avatar: "https://i.pravatar.cc/120?img=5",
    },
  });

  await prisma.user.upsert({
    where: { id: "seed-owner" },
    update: {},
    create: {
      id: "seed-owner",
      name: "Cafe Owner",
      role: UserRole.owner,
      membershipType: MembershipType.Gold,
      avatar: "https://i.pravatar.cc/120?img=12",
    },
  });

  await prisma.song.createMany({
    data: [
      {
        title: "Night Radio",
        artist: "Aero Vibes",
        album: "Late Set",
        coverImage: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600",
        source: SongSource.local,
      },
      {
        title: "Espresso Beat",
        artist: "Lofi Room",
        album: "Cafe Flow",
        coverImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=600",
        source: SongSource.local,
      },
    ],
    skipDuplicates: true,
  });

  const songs = await prisma.song.findMany({ take: 1 });
  if (songs.length > 0) {
    await prisma.order.create({
      data: {
        userId: customer.id,
        songId: songs[0].id,
        queuePosition: 1,
      },
    });
  }
}

main()
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
