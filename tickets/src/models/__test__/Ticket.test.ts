import { Ticket } from './../Ticket';



it('implements Optimistic Concurrency Control or OOC', async () => {
   // create an instance of a ticket
   const ticket = Ticket.build({
      title: 'concert',
      price: 5,
      userId: '123'
   });

   // save the ticket to the database
   await ticket.save();

   // fetch the ticket twice, es solo buscarlo,asin
   const firstInstance = await Ticket.findById(ticket.id);
   const secondInstance = await Ticket.findById(ticket.id);

   // make two separate changes to the tickets we fetched
   firstInstance!.set({ price: 10 });
   secondInstance!.set({ price: 15 });

   // save the first fetched ticket
   await firstInstance!.save();

   // save the second fetched ticket and expect an error
   try {
      await secondInstance!.save();

   } catch (err) {
      return;
   }
   // forma dos
   await expect(secondInstance!.save()).rejects.toThrow();

   throw new Error('Should not reach this point');
});

it('increments the version number on multiples saves', async () => {
   const ticket = Ticket.build({
      title: 'concert',
      price: 20,
      userId: '123'
   });

   await ticket.save();
   expect(ticket.version).toEqual(0);
   await ticket.save();
   expect(ticket.version).toEqual(1);
   await ticket.save();
   expect(ticket.version).toEqual(1); 
});