import React from 'react';
import { Link } from 'react-router-dom';

const services = [
  { title: 'Online Coaching', link: '/coaching', color: '255, 195, 0' },
  { title: 'CRM Tools', link: '/crm', color: '23, 32, 42' },
  { title: 'Video Chat', link: '/video-chat', color: '142, 252, 157' },
  { title: 'Streaming', link: '/streaming', color: '215, 252, 142' },
  { title: 'Blogs', link: '/blogs', color: '252, 252, 142' },
  { title: 'Shops', link: '/shop', color: '252, 208, 142' },
  { title: 'Customizable Profile', link: '/profile', color: '252, 142, 142' },
  { title: 'Consulting', link: '/consulting', color: '252, 142, 239' }
];

const ServiceCards = () => {
  return (
    <div className="wrapper h-[500px] my-12">
      <div className="inner" style={{ '--quantity': services.length } as React.CSSProperties}>
        {services.map((service, index) => (
          <Link
            key={service.title}
            to={service.link}
            className="card"
            style={{ '--index': index, '--color-card': service.color } as React.CSSProperties}
          >
            <div className="img flex items-center justify-center">
              <h3 className="text-xl font-bold text-foreground">{service.title}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ServiceCards;
