import { useEffect, useState, type FormEvent } from "react";
import { api, type Task } from "./api";

export function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    api.list().then(
      (items) => {
        if (active) {
          setTasks(items);
          setLoading(false);
        }
      },
      () => {
        if (active) {
          setError("Nie można pobrać zadań. Sprawdź, czy backend działa.");
          setLoading(false);
        }
      },
    );
    return () => {
      active = false;
    };
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim() || saving || loading) return;
    setSaving(true);
    setError("");
    try {
      const task = await api.create(title.trim());
      setTasks((previous) => [...previous, task]);
      setTitle("");
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "Błąd zapisu.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main>
      <h1>Moje zadania</h1>
      <form onSubmit={submit}>
        <label htmlFor="title">Nowe zadanie</label>
        <input
          id="title"
          value={title}
          maxLength={200}
          required
          onChange={(event) => setTitle(event.target.value)}
        />
        <button disabled={loading || saving || !title.trim()}>
          {saving ? "Zapisywanie…" : "Dodaj"}
        </button>
      </form>
      {error && <p role="alert">{error}</p>}
      {loading ? (
        <p role="status">Ładowanie…</p>
      ) : tasks.length === 0 ? (
        <p>Nie masz jeszcze zadań.</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>{task.title}</li>
          ))}
        </ul>
      )}
    </main>
  );
}
