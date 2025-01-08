import React from 'react';
import { Link } from 'react-router-dom';

const services = [
  { title: 'Online Coaching', link: '/coaching' },
  { title: 'CRM Tools', link: '/crm' },
  { title: 'Video Chat', link: '/video-chat' },
  { title: 'Streaming', link: '/streaming' },
  { title: 'Blogs', link: '/blogs' },
  { title: 'Shops', link: '/shop' },
  { title: 'Customizable Profile', link: '/profile' },
  { title: 'Consulting', link: '/consulting' }
];

const ServiceCards = () => {
  return (
    <div className="wrapper h-[400px] my-12">
      <div className="inner" style={{ '--quantity': services.length } as React.CSSProperties}>
        {services.map((service, index) => (
          <Link
            key={service.title}
            to={service.link}
            className="card"
            style={{ '--index': index } as React.CSSProperties}
          >
            <div className="img flex items-center justify-center">
              <h3 className="text-lg font-bold text-primary">{service.title}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  </div>
  );
};

export default ServiceCards;