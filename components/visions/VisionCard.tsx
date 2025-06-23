import { MotionDiv } from "./motion-div";

interface VisionCardProps {
  title: string;
  description: string;
  icon: string;
  delay?: number;
}

export default function VisionCard({ title, description, icon, delay = 0 }: VisionCardProps) {
  return (
    <MotionDiv
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100 hover:border-blue-100"
    >
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </MotionDiv>
  );
}