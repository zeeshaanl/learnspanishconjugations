# React State Management Guide

## Overview

As your React application grows, it helps to be more intentional about how your state is organized and how data flows between components. Redundant or duplicate state is a common source of bugs. This guide covers how to structure state well, maintain update logic, and share state between components.

## Key Principles

### Reacting to Input with State

With React, you don't modify the UI from code directly. Instead, you describe the UI you want to see for different visual states and trigger state changes in response to user input.

**Example: Quiz Form with Status State**
```javascript
import { useState } from 'react';

export default function Form() {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('typing');

  if (status === 'success') {
    return <h1>That's right!</h1>
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('submitting');
    try {
      await submitForm(answer);
      setStatus('success');
    } catch (err) {
      setStatus('typing');
      setError(err);
    }
  }

  function handleTextareaChange(e) {
    setAnswer(e.target.value);
  }

  return (
    <>
      <h2>City quiz</h2>
      <p>In which city is there a billboard that turns air into drinkable water?</p>
      <form onSubmit={handleSubmit}>
        <textarea
          value={answer}
          onChange={handleTextareaChange}
          disabled={status === 'submitting'}
        />
        <button disabled={answer.length === 0 || status === 'submitting'}>
          Submit
        </button>
        {error !== null && <p className="Error">{error.message}</p>}
      </form>
    </>
  );
}
```

## Choosing the State Structure

### Core Principles for Structuring State

1. **Group related state** - If you always update two or more state variables at the same time, consider merging them into a single state variable
2. **Avoid contradictions in state** - When state is structured so pieces may contradict each other, you leave room for mistakes
3. **Avoid redundant state** - If you can calculate information from props or existing state during rendering, don't put it in state
4. **Avoid duplication in state** - When the same data is duplicated between multiple state variables or nested objects, it's difficult to keep them in sync
5. **Avoid deeply nested state** - Deeply hierarchical state is not convenient to update. Prefer flat structure when possible

### Group Related State

**❌ Avoid: Separate variables that always change together**
```javascript
const [x, setX] = useState(0);
const [y, setY] = useState(0);
```

**✅ Good: Group related state together**
```javascript
const [position, setPosition] = useState({ x: 0, y: 0 });

export default function MovingDot() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  return (
    <div
      onPointerMove={e => {
        setPosition({
          x: e.clientX,
          y: e.clientY
        });
      }}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
      }}>
      <div style={{
        position: 'absolute',
        backgroundColor: 'red',
        borderRadius: '50%',
        transform: `translate(${position.x}px, ${position.y}px)`,
        left: -10,
        top: -10,
        width: 20,
        height: 20,
      }} />
    </div>
  );
}
```

**Important:** When updating object state, you must explicitly copy other fields:
```javascript
// ❌ Wrong: This would lose the y property
setPosition({ x: 100 })

// ✅ Correct: Spread the existing state
setPosition({ ...position, x: 100 })
```

### Avoid Contradictions in State

**❌ Avoid: Multiple booleans that can create impossible states**
```javascript
const [isSending, setIsSending] = useState(false);
const [isSent, setIsSent] = useState(false);
// Problem: both could be true simultaneously
```

**✅ Good: Single status variable with valid states**
```javascript
const [status, setStatus] = useState('typing'); // 'typing' | 'sending' | 'sent'

async function handleSubmit(e) {
  e.preventDefault();
  setStatus('sending');
  await sendMessage(text);
  setStatus('sent');
}

const isSending = status === 'sending';
const isSent = status === 'sent';
```

### Avoid Redundant State

**❌ Avoid: Storing calculated values in state**
```javascript
const [firstName, setFirstName] = useState('');
const [lastName, setLastName] = useState('');
const [fullName, setFullName] = useState(''); // Redundant!

function handleFirstNameChange(e) {
  setFirstName(e.target.value);
  setFullName(e.target.value + ' ' + lastName); // Manual sync required
}
```

**✅ Good: Calculate during render**
```javascript
const [firstName, setFirstName] = useState('');
const [lastName, setLastName] = useState('');
const fullName = firstName + ' ' + lastName; // Calculated automatically

function handleFirstNameChange(e) {
  setFirstName(e.target.value);
}
```

### Avoid Duplication in State

**❌ Avoid: Storing the same object in multiple places**
```javascript
const [items, setItems] = useState(initialItems);
const [selectedItem, setSelectedItem] = useState(items[0]); // Duplicated data
```

**✅ Good: Store only the ID, derive the object**
```javascript
const [items, setItems] = useState(initialItems);
const [selectedId, setSelectedId] = useState(0);
const selectedItem = items.find(item => item.id === selectedId);
```

### Avoid Deeply Nested State

**❌ Avoid: Deep nesting (hard to update)**
```javascript
const travelPlan = {
  id: 0,
  title: '(Root)',
  childPlaces: [{
    id: 1,
    title: 'Earth',
    childPlaces: [{
      id: 2,
      title: 'Africa',
      childPlaces: [/* ... */]
    }]
  }]
};
```

**✅ Good: Flat/normalized structure**
```javascript
const travelPlan = {
  0: { id: 0, title: '(Root)', childIds: [1, 42, 46] },
  1: { id: 1, title: 'Earth', childIds: [2, 10, 19, 26, 34] },
  2: { id: 2, title: 'Africa', childIds: [3, 4, 5, 6, 7, 8, 9] },
  3: { id: 3, title: 'Botswana', childIds: [] },
  // ...
};
```

## Sharing State Between Components

### Lifting State Up

When two components need to share state, move it to their closest common parent and pass it down via props.

**Example: Accordion with shared active state**
```javascript
export default function Accordion() {
  const [activeIndex, setActiveIndex] = useState(0);
  
  return (
    <>
      <h2>Almaty, Kazakhstan</h2>
      <Panel
        title="About"
        isActive={activeIndex === 0}
        onShow={() => setActiveIndex(0)}
      >
        With a population of about 2 million, Almaty is Kazakhstan's largest city.
      </Panel>
      <Panel
        title="Etymology"
        isActive={activeIndex === 1}
        onShow={() => setActiveIndex(1)}
      >
        The name comes from алма, the Kazakh word for "apple".
      </Panel>
    </>
  );
}

function Panel({ title, children, isActive, onShow }) {
  return (
    <section className="panel">
      <h3>{title}</h3>
      {isActive ? <p>{children}</p> : <button onClick={onShow}>Show</button>}
    </section>
  );
}
```

## Preserving and Resetting State

React preserves state for components in the same position in the tree. To force a reset, pass a different `key`:

**Example: Resetting chat input when changing recipients**
```javascript
export default function Messenger() {
  const [to, setTo] = useState(contacts[0]);
  
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedContact={to}
        onSelect={contact => setTo(contact)}
      />
      <Chat key={to.email} contact={to} /> {/* Key forces reset */}
    </div>
  );
}
```

## Advanced State Management

### Extracting State Logic into a Reducer

For components with many state updates, consolidate logic in a reducer:

```javascript
import { useReducer } from 'react';

function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [...tasks, {
        id: action.id,
        text: action.text,
        done: false
      }];
    }
    case 'changed': {
      return tasks.map(t => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter(t => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

export default function TaskApp() {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);

  function handleAddTask(text) {
    dispatch({
      type: 'added',
      id: nextId++,
      text: text,
    });
  }

  function handleChangeTask(task) {
    dispatch({
      type: 'changed',
      task: task
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId
    });
  }

  return (
    <>
      <h1>Prague itinerary</h1>
      <AddTask onAddTask={handleAddTask} />
      <TaskList
        tasks={tasks}
        onChangeTask={handleChangeTask}
        onDeleteTask={handleDeleteTask}
      />
    </>
  );
}
```

### Passing Data Deeply with Context

Context lets you pass data down the component tree without prop drilling:

```javascript
import { createContext, useContext } from 'react';

const LevelContext = createContext(1);

export default function Section({ children }) {
  const level = useContext(LevelContext);
  return (
    <section className="section">
      <LevelContext.Provider value={level + 1}>
        {children}
      </LevelContext.Provider>
    </section>
  );
}

export default function Heading({ children }) {
  const level = useContext(LevelContext);
  switch (level) {
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    // ...
    default:
      return <h6>{children}</h6>;
  }
}
```

## When You Might Not Need an Effect

### Remove Unnecessary Effects

**❌ Avoid: Using Effects for calculations**
```javascript
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');
  const [fullName, setFullName] = useState('');
  
  useEffect(() => {
    setFullName(firstName + ' ' + lastName);
  }, [firstName, lastName]); // Unnecessary Effect
}
```

**✅ Good: Calculate during rendering**
```javascript
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');
  const fullName = firstName + ' ' + lastName; // Calculated directly
}
```

### Caching Expensive Calculations

Use `useMemo` instead of Effects for expensive calculations:

```javascript
import { useMemo, useState } from 'react';

function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');
  
  const visibleTodos = useMemo(() => {
    return getFilteredTodos(todos, filter);
  }, [todos, filter]);
  
  // ...
}
```

### Resetting State on Prop Changes

**❌ Avoid: Using Effects to reset state**
```javascript
export default function ProfilePage({ userId }) {
  const [comment, setComment] = useState('');
  
  useEffect(() => {
    setComment('');
  }, [userId]); // Causes extra render
}
```

**✅ Good: Use key to reset component**
```javascript
export default function ProfilePage({ userId }) {
  return (
    <Profile
      userId={userId}
      key={userId} // Forces reset when userId changes
    />
  );
}

function Profile({ userId }) {
  const [comment, setComment] = useState(''); // Resets automatically
}
```

### Adjusting State During Render

For partial state updates based on props:

```javascript
function List({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selection, setSelection] = useState(null);

  // Adjust state during render
  const [prevItems, setPrevItems] = useState(items);
  if (items !== prevItems) {
    setPrevItems(items);
    setSelection(null);
  }
}
```

**Better: Store derived state**
```javascript
function List({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  
  // Calculate selection from current items
  const selection = items.find(item => item.id === selectedId) ?? null;
}
```

### Event-Specific Logic Belongs in Event Handlers

**❌ Avoid: Effects for user interactions**
```javascript
function ProductPage({ product, addToCart }) {
  useEffect(() => {
    if (product.isInCart) {
      showNotification(`Added ${product.name} to the shopping cart!`);
    }
  }, [product]); // Runs on every product change
}
```

**✅ Good: Handle in event handlers**
```javascript
function ProductPage({ product, addToCart }) {
  function buyProduct() {
    addToCart(product);
    showNotification(`Added ${product.name} to the shopping cart!`);
  }

  function handleBuyClick() {
    buyProduct();
  }

  function handleCheckoutClick() {
    buyProduct();
    navigateTo('/checkout');
  }
}
```

### Data Fetching with Effects

When fetching data in Effects, always implement cleanup to avoid race conditions:

```javascript
function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  
  useEffect(() => {
    let ignore = false;
    
    fetchResults(query, page).then(json => {
      if (!ignore) {
        setResults(json);
      }
    });
    
    return () => {
      ignore = true; // Cleanup: ignore stale responses
    };
  }, [query, page]);

  function handleNextPageClick() {
    setPage(page + 1);
  }
}
```

## Summary

### State Structure Best Practices
- Group related state variables
- Avoid contradictory states by using enums/status variables
- Don't store calculated values in state
- Avoid data duplication
- Prefer flat over deeply nested structures

### When to Use Effects
- ✅ Synchronizing with external systems
- ✅ Data fetching (with proper cleanup)
- ✅ Setting up subscriptions
- ❌ Calculating values that can be derived during render
- ❌ Handling user events (use event handlers instead)
- ❌ Resetting state (use keys instead)

### Performance Optimizations
- Use `useMemo` for expensive calculations
- Use `useReducer` for complex state logic
- Use Context for deep prop passing
- Lift state up to share between components