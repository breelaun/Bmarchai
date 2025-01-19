import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface CardStyle extends React.CSSProperties {
  '--index'?: number;
  '--quantity'?: number;
  '--w'?: string;
  '--h'?: string;
  '--translateZ'?: string;
  '--rotateX'?: string;
  '--perspective'?: string;
  '--color-card'?: string;
}

const ServiceCards = () => {
  const [isRotating, setIsRotating] = useState(true);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!wrapperRef.current) return;
      const rect = wrapperRef.current.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;
      setIsRotating(isVisible);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cards = [
    {
      title: 'Fitness Training',
      image: '/lovable-uploads/Banner01.jpg',
      color: '255, 99, 71',
      link: '/sessions'
    },
    {
      title: 'Nutrition Planning',
      image: '/lovable-uploads/Banner01.jpg',
      color: '50, 205, 50',
      link: '/nutrition'
    },
    {
      title: 'Wellness Coaching',
      image: '/lovable-uploads/Banner01.jpg',
      color: '70, 130, 180',
      link: '/wellness'
    },
    {
      title: 'Sports Training',
      image: '/lovable-uploads/Banner01.jpg',
      color: '218, 112, 214',
      link: '/sports'
    }
  ];

  const innerStyle: CardStyle = {
    animation: isRotating ? 'rotating 20s linear infinite' : 'none',
    transform: !isRotating ? 'perspective(1000px) rotateX(-11deg) rotateY(0)' : undefined,
    '--quantity': cards.length,
    '--w': '250px',
    '--h': '150px',
    '--translateZ': 'calc((var(--w) + var(--h)) + 0px)',
    '--rotateX': '-11deg',
    '--perspective': '1000px'
  };

  return (
    <div ref={wrapperRef} className="wrapper">
      <div className="inner" style={innerStyle}>
        {cards.map((card, index) => (
          <Link
            key={index}
            to={card.link}
            className="card"
            style={{
              '--index': index,
              '--color-card': card.color
            } as CardStyle}
          >
            <img src={card.image} alt={card.title} className="img" />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ServiceCards;