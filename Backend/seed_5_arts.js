const fs = require('fs');

async function seed() {
  // Ensure categories
  const categories = ['Paintings', 'Sculptures', 'Heritage Crafts', 'Contemporary Art'];
  for (const name of categories) {
    try {
      const res = await fetch('http://localhost:5000/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description: name + ' collection', status: 'Active' })
      });
      const data = await res.json();
      console.log('Category create', name, data.success ? 'OK' : data.message);
    } catch (e) {
      console.error('Error creating category:', e.message);
    }
  }

  // Define 5 artworks
  const arts = [
    {
      artNo: 'ART-0002',
      title: 'Whispering Lotus Serenity',
      category: 'Paintings',
      artType: 'General Artwork',
      isPublished: true,
      status: 'Published',
      artistName: 'Meera Raghunath',
      price: 18500,
      discount: 10,
      stockQuantity: 4,
      tags: ['Lotus', 'Canvas', 'Oil Painting', 'Traditional', 'Meditation'],
      description: '<p>A serene oil-on-canvas masterpiece depicting blooming water lilies in an Indian temple pond at dawn, symbolizing enlightenment, peace, and spiritual rebirth.</p>',
      artistAbout: 'Meera is a renowned Kerala-based artist known for devotional and landscape oil paintings.',
      sizeOverview: '24 x 36 inches (60 x 91 cm)',
      framing: 'Yes',
      certificate: 'Yes',
      photos: [{ id: 'p1', name: 'shop-1.webp', url: '/uploads/arts/shop-1.webp' }]
    },
    {
      artNo: 'ART-0003',
      title: 'Celestial Rhythms of Nataraja',
      category: 'Sculptures',
      artType: 'Streaming Collection',
      isPublished: true,
      status: 'Published',
      artistName: 'Devendra Acharya',
      price: 32000,
      discount: 15,
      stockQuantity: 2,
      tags: ['Bronze', 'Nataraja', 'Chola', 'Classical', 'Sculpture'],
      description: '<p>Handcrafted lost-wax bronze casting celebrating the eternal cosmic dance of Shiva Nataraja, featuring exquisite detailing and antique patina finish.</p>',
      artistAbout: 'Master bronze sculptor continuing a 6-generation legacy of Thanjavur metal artisans.',
      sizeOverview: '18 x 14 x 8 inches, 6.2 kg',
      framing: 'No',
      certificate: 'Yes',
      photos: [{ id: 'p2', name: 'shop-2.webp', url: '/uploads/arts/shop-2.webp' }]
    },
    {
      artNo: 'ART-0004',
      title: 'Golden Mirage of the Thar',
      category: 'Heritage Crafts',
      artType: 'General Artwork',
      isPublished: true,
      status: 'Published',
      artistName: 'Bhavna Rathore',
      price: 14200,
      discount: 5,
      stockQuantity: 6,
      tags: ['Folk Art', 'Rajasthan', 'Miniature', 'Gold Foil', 'Heritage'],
      description: '<p>Traditional Kishangarh miniature painting rendered on treated handmade paper using natural pigments, real crushed stone powders, and 24K gold foil embellishments.</p>',
      artistAbout: 'National award-winning miniature painter based in Jaipur.',
      sizeOverview: '16 x 20 inches (40 x 50 cm)',
      framing: 'Yes',
      certificate: 'Yes',
      photos: [{ id: 'p3', name: 'shop-3.webp', url: '/uploads/arts/shop-3.webp' }]
    },
    {
      artNo: 'ART-0005',
      title: 'Echoes of Varanasi Ghats',
      category: 'Contemporary Art',
      artType: 'Streaming Collection',
      isPublished: true,
      status: 'Published',
      artistName: 'Arjun Mukherjee',
      price: 24500,
      discount: 20,
      stockQuantity: 3,
      tags: ['Varanasi', 'Ghats', 'Acrylic', 'Impressionism', 'Ganga'],
      description: '<p>Dynamic acrylic-on-linen work capturing the vibrant interplay of evening lamps (diyas), sacred waters, and temple reflections along the timeless steps of Varanasi.</p>',
      artistAbout: 'Contemporary expressionist painter and graduate of Shantiniketan Kala Bhavana.',
      sizeOverview: '30 x 40 inches (76 x 101 cm)',
      framing: 'Yes',
      certificate: 'Yes',
      photos: [{ id: 'p4', name: 'shop-4.webp', url: '/uploads/arts/shop-4.webp' }]
    },
    {
      artNo: 'ART-0006',
      title: 'Tree of Life - Gond Symphony',
      category: 'Heritage Crafts',
      artType: 'General Artwork',
      isPublished: true,
      status: 'Published',
      artistName: 'Santosh Shyam',
      price: 12800,
      discount: 0,
      stockQuantity: 5,
      tags: ['Gond', 'Tribal Art', 'Madhya Pradesh', 'Nature', 'Tree of Life'],
      description: '<p>Authentic Gond tribal painting rendered with intricate signature dot-and-line patterns depicting birds and woodland spirits sheltering under the sacred Mahua tree.</p>',
      artistAbout: 'Acclaimed tribal artist carrying forward celebrated Gond style.',
      sizeOverview: '20 x 28 inches (50 x 71 cm)',
      framing: 'No',
      certificate: 'Yes',
      photos: [{ id: 'p5', name: 'shop-5.webp', url: '/uploads/arts/shop-5.webp' }]
    }
  ];

  for (const art of arts) {
    try {
      const res = await fetch('http://localhost:5000/api/arts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(art)
      });
      const data = await res.json();
      console.log('Art created:', art.artNo, art.title, data.success ? 'SUCCESS' : data.message);
    } catch (e) {
      console.error('Error creating art:', art.artNo, e.message);
    }
  }

  // Verify total arts
  const allRes = await fetch('http://localhost:5000/api/arts');
  const allData = await allRes.json();
  console.log('\n--- Total Arts in DB now:', allData.data.length, '---');
  allData.data.forEach(a => {
    console.log('[' + a.artNo + '] ' + a.title + ' | ' + a.category + ' | ' + a.artType + ' | Status: ' + a.status + ' | Stock: ' + a.stockQuantity);
  });
}

seed();
