import { ShieldCheck, Truck, Gift, Leaf, Package } from 'lucide-react';
import { useMockData } from '../../data/mockData';
import { StaggerContainer, StaggerItem } from '../ui/Stagger';

const getIcon = (name: string) => {
  const className = "w-8 h-8 text-brand-pink mb-3";
  switch (name) {
    case 'ShieldCheck': return <ShieldCheck className={className} />;
    case 'Truck': return <Truck className={className} />;
    case 'Gift': return <Gift className={className} />;
    case 'GiftBox': return <Package className={className} />;
    case 'Leaf': return <Leaf className={className} />;
    default: return <Gift className={className} />;
  }
};

export default function Features() {
  const { features } = useMockData();
  return (
    <section className="bg-white py-12 relative z-10 w-full overflow-hidden">
      {/* Decorative branches */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-90 pointer-events-none z-0">
        <img src="/images/decorations/floral.png" alt="" className="w-24 md:w-32 lg:w-40 object-contain translate-x-4 md:translate-x-8 mix-blend-multiply" />
      </div>
      
      <div className="absolute left-0 top-1/2 -translate-y-1/2 opacity-90 pointer-events-none transform scale-x-[-1] z-0">
        <img src="/images/decorations/floral.png" alt="" className="w-24 md:w-32 lg:w-40 object-contain translate-x-4 md:translate-x-8 mix-blend-multiply" />
      </div>

      <div className="max-w-7xl mx-auto px-12 sm:px-16 lg:px-24">
        <StaggerContainer className="flex flex-col md:flex-row justify-between items-center w-full">
          {features.map((feature, index) => (
            <StaggerItem key={feature.id} className="flex flex-1 items-center justify-center relative w-full py-4">
              <div className="flex flex-col items-center text-center px-4 w-full group cursor-pointer">
                <div className="transform transition-transform duration-300 group-hover:scale-110">
                  {getIcon(feature.icon)}
                </div>
                <h3 className="text-base md:text-lg font-bold text-brand-brown mb-1 whitespace-nowrap">{feature.title}</h3>
                <p className="text-sm text-brand-brown/60 whitespace-nowrap">{feature.subtitle}</p>
              </div>
              {/* Vertical Divider */}
              {index < features.length - 1 && (
                <div className="hidden md:block absolute left-0 w-[1px] h-12 bg-brand-brown/10"></div>
              )}
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
