'use client'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="fixed top-0 w-full border-b border-gray-100 bg-white/80 backdrop-blur z-50">
        <div className="max-w-6xl mx-auto px-8 py-5 flex justify-between items-center">
          <div className="font-mono text-xs tracking-wide text-gray-900">
            @chemmangat/optimistic-update
          </div>
          <div className="flex gap-8 text-xs">
            <a href="https://www.npmjs.com/package/@chemmangat/optimistic-update" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-900 transition-colors">npm</a>
            <a href="https://github.com/chemmangat/optimistic-update" className="text-gray-500 hover:text-gray-900 transition-colors">github</a>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-8">
        <section className="min-h-screen flex flex-col justify-center pt-32 pb-20">
          <div className="w-full">
            <h1 className="text-8xl font-extralight tracking-tight text-gray-900 mb-8 leading-none">
              Instant UI updates
            </h1>
            <p className="text-2xl text-gray-500 font-light mb-4 max-w-3xl leading-relaxed">
              Make your React apps feel instant with optimistic updates. Update the UI immediately, save in the background, and automatically rollback on errors.
            </p>
            <p className="text-lg text-gray-400 mb-12 max-w-2xl">
              One hook that works like useState. Zero configuration. Zero dependencies.
            </p>
            <code className="inline-block px-5 py-3 bg-gray-50 border border-gray-200 rounded text-sm font-mono text-gray-700">
              npm install @chemmangat/optimistic-update
            </code>
          </div>
        </section>

        <section className="py-32 border-t border-gray-100">
          <div className="mb-16">
            <div className="text-xs text-gray-400 uppercase tracking-widest mb-4">Example</div>
            <h2 className="text-4xl font-extralight text-gray-900 mb-4">The simplest use case</h2>
            <p className="text-lg text-gray-500 max-w-2xl">
              Works exactly like useState, but with an optional second parameter for your API call. 
              If the request fails, the UI automatically reverts to its previous state.
            </p>
          </div>
          
          <div className="bg-gray-900 rounded-lg p-10">
            <pre className="text-sm font-mono text-gray-100 leading-loose overflow-x-auto">
              <code>{`import { useOptimistic } from '@chemmangat/optimistic-update'

function Counter() {
  const [count, setCount] = useOptimistic(0)
  
  return (
    <button onClick={() => 
      setCount(count + 1, () => fetch('/api/increment', { method: 'POST' }))
    }>
      {count}
    </button>
  )
}

// That's it. The UI updates instantly. If the fetch fails, it rolls back automatically.`}</code>
            </pre>
          </div>
        </section>

        <section className="py-32 border-t border-gray-100">
          <div className="mb-16">
            <div className="text-xs text-gray-400 uppercase tracking-widest mb-4">Process</div>
            <h2 className="text-4xl font-extralight text-gray-900 mb-4">How it works</h2>
            <p className="text-lg text-gray-500 max-w-2xl">
              Three simple steps happen automatically every time you update state with a mutation function.
            </p>
          </div>
          
          <div className="grid grid-cols-3 gap-16">
            <div>
              <div className="text-xs text-gray-400 font-mono mb-4">01</div>
              <h3 className="text-2xl font-light text-gray-900 mb-4">Update instantly</h3>
              <p className="text-base text-gray-500 leading-relaxed">
                The UI changes immediately when the user interacts. No loading spinners, no waiting. 
                Your app feels fast because it is fast.
              </p>
            </div>
            <div>
              <div className="text-xs text-gray-400 font-mono mb-4">02</div>
              <h3 className="text-2xl font-light text-gray-900 mb-4">Save in background</h3>
              <p className="text-base text-gray-500 leading-relaxed">
                The API request runs in the background while the user continues working. 
                Non-blocking, non-intrusive, exactly how it should be.
              </p>
            </div>
            <div>
              <div className="text-xs text-gray-400 font-mono mb-4">03</div>
              <h3 className="text-2xl font-light text-gray-900 mb-4">Auto rollback</h3>
              <p className="text-base text-gray-500 leading-relaxed">
                If the request fails, the state automatically reverts to what it was before. 
                No manual error handling, no cleanup code required.
              </p>
            </div>
          </div>
        </section>

        <section className="py-32 border-t border-gray-100">
          <div className="mb-16">
            <div className="text-xs text-gray-400 uppercase tracking-widest mb-4">Real examples</div>
            <h2 className="text-4xl font-extralight text-gray-900 mb-4">Common use cases</h2>
            <p className="text-lg text-gray-500 max-w-2xl">
              From like buttons to todo lists, optimistic updates make every interaction feel instant.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-12">
            <div className="bg-gray-50 rounded-lg p-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Like button</h3>
              <pre className="text-sm font-mono text-gray-700 leading-relaxed overflow-x-auto">
                <code>{`const [likes, setLikes] = useOptimistic(42)

<button onClick={() => 
  setLikes(likes + 1, 
    () => fetch('/api/like', { method: 'POST' })
  )
}>
  {likes} likes
</button>`}</code>
              </pre>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Delete todo</h3>
              <pre className="text-sm font-mono text-gray-700 leading-relaxed overflow-x-auto">
                <code>{`const [todos, setTodos] = useOptimistic(items)

const remove = (id) => {
  setTodos(
    todos.filter(t => t.id !== id),
    () => fetch(\`/api/todos/\${id}\`, { 
      method: 'DELETE' 
    })
  )
}`}</code>
              </pre>
            </div>
          </div>
        </section>

        <section className="py-32 border-t border-gray-100">
          <div className="mb-16">
            <div className="text-xs text-gray-400 uppercase tracking-widest mb-4">Features</div>
            <h2 className="text-4xl font-extralight text-gray-900 mb-4">Why developers choose this</h2>
            <p className="text-lg text-gray-500 max-w-2xl">
              Built for developers who want great UX without the complexity.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-x-20 gap-y-12">
            <div>
              <h3 className="text-xl font-light text-gray-900 mb-3">Zero setup required</h3>
              <p className="text-base text-gray-500 leading-relaxed">
                No providers to wrap your app in. No configuration files to manage. 
                Just import the hook and start using it. Works with any React project.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-light text-gray-900 mb-3">Familiar API</h3>
              <p className="text-base text-gray-500 leading-relaxed">
                If you know how to use useState, you already know how to use this. 
                Same signature, same patterns. Zero learning curve.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-light text-gray-900 mb-3">Automatic error handling</h3>
              <p className="text-base text-gray-500 leading-relaxed">
                Failed requests automatically trigger a rollback to the previous state. 
                No try-catch blocks, no manual state restoration, no cleanup code.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-light text-gray-900 mb-3">Lightweight bundle</h3>
              <p className="text-base text-gray-500 leading-relaxed">
                Only 20KB minified. Zero dependencies except React. 
                Fast to download, fast to parse, fast to execute.
              </p>
            </div>
          </div>
        </section>

        <section className="py-32 border-t border-gray-100">
          <div className="mb-16">
            <div className="text-xs text-gray-400 uppercase tracking-widest mb-4">Comparison</div>
            <h2 className="text-4xl font-extralight text-gray-900 mb-4">Before and after</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-12">
            <div>
              <div className="text-sm text-gray-500 mb-4">Without optimistic updates</div>
              <div className="bg-gray-50 rounded-lg p-8">
                <pre className="text-sm font-mono text-gray-600 leading-relaxed">
                  <code>{`const handleClick = async () => {
  setLoading(true)
  try {
    await fetch('/api/endpoint')
    await refetch()
  } catch (err) {
    setError(err)
  }
  setLoading(false)
}

// Users wait 500ms+ for every action`}</code>
                </pre>
              </div>
            </div>
            
            <div>
              <div className="text-sm text-gray-900 mb-4">With optimistic updates</div>
              <div className="bg-gray-900 rounded-lg p-8">
                <pre className="text-sm font-mono text-gray-100 leading-relaxed">
                  <code>{`const [data, setData] = useOptimistic(initial)

const handleClick = () => {
  setData(
    newData,
    () => fetch('/api/endpoint')
  )
}

// Instant feedback, automatic rollback`}</code>
                </pre>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-100 mt-20">
        <div className="max-w-6xl mx-auto px-8 py-16">
          <div className="flex justify-between items-center text-xs text-gray-400">
            <div className="font-mono">MIT License</div>
            <div className="flex gap-10">
              <a href="https://github.com/chemmangat/optimistic-update" className="hover:text-gray-900 transition-colors">github</a>
              <a href="https://www.npmjs.com/package/@chemmangat/optimistic-update" className="hover:text-gray-900 transition-colors">npm</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
