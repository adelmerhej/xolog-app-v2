import { MotionDiv } from "./motion-div";

interface ServiceHighlightProps {
  title: string;
  description: string;
  delay?: number;
}

export default function ServiceHighlight({ title, description, delay = 0 }: ServiceHighlightProps) {
  return (
    <MotionDiv
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className="bg-white/10 p-6 rounded-xl backdrop-blur-sm border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-[1.02]"
    >
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-blue-100">{description}</p>
    </MotionDiv>
  );
}