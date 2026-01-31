export default function QuizQuestPage() {
  return (
    <div
      className="min-h-screen p-6 pb-8"
      style={{
        background: 'linear-gradient(135deg, var(--summer-accent)20 0%, var(--spring-accent)20 100%)',
      }}
    >
      <div className="max-w-2xl mx-auto text-center mt-20">
        <div className="text-8xl mb-8 animate-float-tree">🎯</div>
        <h1
          className="text-4xl font-bold mb-6"
          style={{
            fontFamily: 'var(--font-display)',
            color: 'var(--forest-700)',
          }}
        >
          Quiz Quest
        </h1>
        <p
          className="text-lg mb-10 max-w-xl mx-auto leading-relaxed"
          style={{ color: 'var(--warm-gray-700)' }}
        >
          Test your medication knowledge with fun quizzes and earn bonus HP!
        </p>
        <div className="glass-card p-12">
          <div className="text-5xl mb-4">🚧</div>
          <p
            className="text-base font-semibold mb-2"
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--warm-gray-700)',
            }}
          >
            Coming Soon
          </p>
          <p
            className="text-sm"
            style={{ color: 'var(--warm-gray-500)' }}
          >
            This feature is under development
          </p>
        </div>
      </div>
    </div>
  )
}
