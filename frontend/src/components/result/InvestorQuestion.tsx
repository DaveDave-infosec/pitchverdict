import './InvestorQuestion.css';

interface InvestorQuestionProps {
  question: string;
  visible: boolean;
}

export function InvestorQuestion({ question, visible }: InvestorQuestionProps) {
  if (!question) return null;
  return (
    <section className={`investor-question ${visible ? 'investor-question--visible' : ''}`}>
      <header className="investor-question__head">
        <span className="investor-question__label">The question partners ask first</span>
      </header>
      <p className="investor-question__text">{question}</p>
    </section>
  );
}