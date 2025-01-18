import React from 'react';
import { Link } from 'react-router-dom';

const services = [
  { title: 'Online Coaching', link: '/coaching', color: '255, 195, 0' },
  { title: 'CRM Tools', link: '/crm', color: '44, 62, 80' },
  { title: 'Video Chat', link: '/video-chat', color: '255, 195, 0' },
  { title: 'Streaming', link: '/streaming', color: '44, 62, 80' },
  { title: 'Blogs', link: '/blogs', color: '255, 195, 0' },
  { title: 'Shops', link: '/shop', color: '44, 62, 80' },
  { title: 'Customizable Profile', link: '/profile', color: '255, 195, 0' },
  { title: 'Consulting', link: '/consulting', color: '44, 62, 80' }
];

const ServiceCards = () => {
  return (
    <div className="wrapper h-[300px] sm:h-[400px] md:h-[500px] my-6 sm:my-8 md:my-12">
      <div 
        className="inner" 
        style={{ '--quantity': services.length } as React.CSSProperties}
      >
        {services.map((service, index) => (
          <Link
            key={service.title}
            to={service.link}
            className="card text-center"
            style={{ 
              '--index': index, 
              '--color-card': service.color 
            } as React.CSSProperties}
          >
            <div className="img flex items-center justify-center p-2">
              <h3 className="text-sm sm:text-base md:text-xl font-bold text-foreground">
                {service.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ServiceCards;
