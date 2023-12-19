import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export  async function DELETE(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  } else {

    const url = new URL(req.url);
    const Id = url.searchParams.get("Id");
    console.log(Id,"deleteeeeeeeeeeeeeeeeeeeeeeee")

    if (!Id) {
      return res.status(400).json({ error: 'UserId not provided in the URL' });
    }

    try {
      const deletedItem = await prisma.tickets.delete({
        where: {
          id: Id,
        },
      });

      res.status(200).json(deletedItem);
    } catch (error) {
      console.error('Error deleting item:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}
