
import { useEffect, useState } from 'react';
import { supabase } from './supabase';

const startDate = new Date(2026, 10, 18);

function getWeekNumber(date) {
  const day = new Date(date);
  day.setHours(0, 0, 0, 0);
  day.setDate(day.getDate() - ((day.getDay() - 3 + 7) % 7));

  if (day < startDate) return 0;
  return Math.floor((day - startDate) / 604800000);
}

function getWeekDate(index) {
  const date = new Date(startDate);
  date.setDate(date.getDate() + index * 7);
  return date;
}

function formatDate(date) {
  return date.toLocaleDateString('sv-SE', {
    day: 'numeric',
    month: 'long',
  });
}

const presentation = {
  Onsdagsdeppet: {
    emoji: '🫠',
    color: '#F3B6A7',
    text: '#422B27',
  },
  Albumsläppet: {
    emoji: '💿',
    color: '#C8C2EB',
    text: '#30294D',
  },
  Fredagspeppen: {
    emoji: '🎉',
    color: '#F4D16E',
    text: '#493A19',
  },
};

const styles = `
* { box-sizing: border-box; }

body {
  margin: 0;
  background: #F7EBD8;
  font-family: 'Trebuchet MS', Arial, sans-serif;
}

button, input { font: inherit; }

button { cursor: pointer; }

button:disabled {
  opacity: .4;
  cursor: not-allowed;
}

.app {
  min-height: 100vh;
  background: #F7EBD8;
  padding: 34px 18px 50px;
  color: #25221F;
}

.container {
  max-width: 570px;
  margin: auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.logo {
  font-size: 30px;
  font-weight: 1000;
  letter-spacing: -1.5px;
}

.subtitle {
  font-size: 11px;
  letter-spacing: 2px;
  color: #71675C;
  margin-top: 5px;
  font-weight: bold;
}

.star {
  background: #F3A64B;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-size: 29px;
}

.welcome {
  background: #D8E8CF;
  border-radius: 22px;
  padding: 22px;
  margin-bottom: 20px;
}

.welcome h1 {
  margin: 0 0 5px;
  font-size: 29px;
}

.welcome p {
  margin: 0;
  color: #405744;
  font-size: 14px;
}

.week-label {
  display: inline-block;
  background: #fff9;
  border-radius: 30px;
  padding: 7px 12px;
  font-size: 11px;
  font-weight: bold;
  margin-bottom: 12px;
}

.card {
  border-radius: 22px;
  padding: 21px 23px;
  margin-bottom: 15px;
  box-shadow: 0 5px 0 #0000000a;
}

.day-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.day {
  font-size: 23px;
  font-weight: 1000;
  letter-spacing: 1px;
}

.emoji { font-size: 27px; }

.responsibility {
  font-size: 14px;
  font-weight: bold;
  margin-top: 7px;
}

.card hr {
  border: 0;
  border-top: 1px solid #00000022;
  margin: 17px 0 13px;
}

.person {
  font-size: 34px;
  font-weight: 1000;
  letter-spacing: -1px;
}

.next {
  background: #25221F;
  color: #F7EBD8;
  padding: 23px;
  border-radius: 20px;
  margin-top: 23px;
}

.next-label {
  font-size: 10px;
  letter-spacing: 2px;
  color: #C8BDAF;
  font-weight: bold;
}

.next h2 {
  font-size: 22px;
  color: #F3A64B;
  margin: 10px 0;
}

.next-people {
  font-size: 17px;
  color: #F7EBD8;
  font-weight: bold;
}

.next-date {
  font-size: 12px;
  color: #C8BDAF;
  margin-top: 8px;
}

.navigation {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin: 25px 0 5px;
}

.nav-button {
  border: 0;
  background: white;
  border-radius: 50px;
  padding: 12px 18px;
  cursor: pointer;
  font-weight: bold;
}

.nav-title {
  font-size: 13px;
  font-weight: bold;
}

.footer {
  text-align: center;
  font-size: 10px;
  letter-spacing: 2px;
  color: #71675C;
  margin-top: 30px;
}

.message {
  background: white;
  padding: 20px;
  border-radius: 15px;
  margin: 20px 0;
}

.admin-area {
  margin-bottom: 20px;
}

.login-form, .admin-panel {
  background: white;
  padding: 22px;
  border-radius: 18px;
  margin-top: 12px;
}

.login-form h3, .admin-panel h2 {
  margin-top: 0;
}

.login-input {
  width: 100%;
  padding: 13px;
  border: 1px solid #ddd;
  border-radius: 10px;
  margin-bottom: 12px;
  background: white;
}

.login-button, .save-button {
  border: 0;
  background: #25221F;
  color: white;
  border-radius: 50px;
  padding: 13px 22px;
  cursor: pointer;
  font-weight: bold;
}

.login-error, .error-text {
  color: #b00020;
  font-size: 13px;
}

.admin-status {
  background: #D8E8CF;
  padding: 15px;
  border-radius: 14px;
  margin-top: 12px;
  font-size: 13px;
}

.admin-tabs {
  display: flex;
  gap: 8px;
  margin: 18px 0;
  flex-wrap: wrap;
}

.tab-button {
  border: 0;
  padding: 10px 14px;
  border-radius: 30px;
  background: #F1EDE7;
  font-size: 12px;
  font-weight: bold;
}

.tab-button.active {
  background: #25221F;
  color: white;
}

.admin-section {
  background: #FAF7F2;
  border-radius: 14px;
  padding: 15px;
  margin-bottom: 15px;
}

.admin-section h3 {
  margin: 0 0 12px;
  font-size: 16px;
}

.person-row, .rotation-row {
  display: flex;
  align-items: center;
  gap: 8px;
  background: white;
  border-radius: 10px;
  padding: 9px;
  margin-bottom: 8px;
}

.person-row input {
  flex: 1;
  min-width: 0;
  border: 1px solid #e3ded6;
  border-radius: 8px;
  padding: 10px;
}

.rotation-name {
  flex: 1;
  font-weight: bold;
  font-size: 14px;
}

.small-button {
  border: 0;
  border-radius: 8px;
  padding: 9px 11px;
  background: #eee8df;
  font-weight: bold;
}

.delete-button {
  background: #F7DFD9;
  color: #922D22;
}

.add-row {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.add-row input {
  flex: 1;
  min-width: 0;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 11px;
}

.info-text {
  font-size: 12px;
  line-height: 1.5;
  color: #71675C;
}

.admin-message {
  padding: 12px;
  background: #D8E8CF;
  border-radius: 10px;
  font-size: 13px;
  margin: 12px 0;
}

.admin-error {
  padding: 12px;
  background: #F7DFD9;
  border-radius: 10px;
  font-size: 13px;
  color: #922D22;
  margin: 12px 0;
}

@media (max-width: 400px) {
  .logo { font-size: 25px; }
  .person { font-size: 30px; }
  .person-row, .rotation-row { gap: 5px; }
  .small-button { padding: 8px; }
}
`;

function App() {
  const [week, setWeek] = useState(() =>
    Math.max(0, getWeekNumber(new Date()))
  );

  const [people, setPeople] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Inloggning
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Administration
  const [adminOpen, setAdminOpen] = useState(false);
  const [adminTab, setAdminTab] = useState('people');
  const [newPersonName, setNewPersonName] = useState('');
  const [saving, setSaving] = useState(false);
  const [adminMessage, setAdminMessage] = useState('');
  const [adminError, setAdminError] = useState('');
  const [rotationDrafts, setRotationDrafts] = useState({});

  // Hämta personer och scheman
  async function loadData() {
    setLoading(true);
    setError('');

    const [peopleResult, schedulesResult] = await Promise.all([
      supabase
        .from('people')
        .select('id, name, position')
        .order('position'),

      supabase
        .from('responsibilities')
        .select('id, name, weekday, rotation')
        .order('weekday'),
    ]);

    if (peopleResult.error) {
      setError('Kunde inte hämta personerna: ' + peopleResult.error.message);
      setLoading(false);
      return;
    }

    if (schedulesResult.error) {
      setError('Kunde inte hämta schemat: ' + schedulesResult.error.message);
      setLoading(false);
      return;
    }

    const peopleData = peopleResult.data || [];
    const schedulesData = schedulesResult.data || [];

    setPeople(peopleData);

    const peopleById = Object.fromEntries(
      peopleData.map((person) => [person.id, person.name])
    );

    const formattedSchedules = schedulesData.map((schedule) => ({
      ...schedule,
      people: (schedule.rotation || []).map(
        (id) => peopleById[id] || 'Okänd person'
      ),
      ...presentation[schedule.name],
    }));

    setSchedules(formattedSchedules);

    setRotationDrafts(
      Object.fromEntries(
        schedulesData.map((schedule) => [
          schedule.id,
          [...(schedule.rotation || [])],
        ])
      )
    );

    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  // Kontrollera användare och administratör
  useEffect(() => {
    let active = true;

    async function checkAdmin(currentUser) {
      if (!currentUser) {
        if (active) setIsAdmin(false);
        return;
      }

      const { data, error } = await supabase.rpc('is_admin');

      if (active) {
        setIsAdmin(!error && data === true);
      }
    }

    supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return;

      if (error) {
        setAuthLoading(false);
        return;
      }

      const currentUser = data.session?.user ?? null;
      setUser(currentUser);

      checkAdmin(currentUser).finally(() => {
        if (active) setAuthLoading(false);
      });
    });

    const { data: listener } =
      supabase.auth.onAuthStateChange((_event, session) => {
        if (!active) return;

        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (!currentUser) {
          setIsAdmin(false);
          setAuthLoading(false);
          setAdminOpen(false);
          return;
        }

        Promise.resolve().then(() => {
          if (active) checkAdmin(currentUser);
        });
      });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  async function handleLogin(e) {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setLoginLoading(false);

    if (error) {
      setLoginError('Inloggningen misslyckades: ' + error.message);
      return;
    }

    setPassword('');
    setShowLogin(false);
  }

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      setLoginError('Kunde inte logga ut: ' + error.message);
      return;
    }

    setUser(null);
    setIsAdmin(false);
    setAdminOpen(false);
    setShowLogin(false);
  }

  function clearAdminMessages() {
    setAdminMessage('');
    setAdminError('');
  }

  // Byt namn på person
  async function renamePerson(person, newName) {
    const cleanName = newName.trim();

    if (!cleanName) {
      setAdminError('Namnet får inte vara tomt.');
      return;
    }

    if (cleanName === person.name) return;

    setSaving(true);
    clearAdminMessages();

    const { error } = await supabase
      .from('people')
      .update({ name: cleanName })
      .eq('id', person.id);

    setSaving(false);

    if (error) {
      setAdminError('Kunde inte ändra namnet: ' + error.message);
      return;
    }

    setAdminMessage('Namnet har sparats.');
    await loadData();
  }

  // Lägg till person via säker databasfunktion
  async function addPerson(e) {
    e.preventDefault();

    const cleanName = newPersonName.trim();

    if (!cleanName) {
      setAdminError('Skriv ett namn först.');
      return;
    }

    setSaving(true);
    clearAdminMessages();

    const { error } = await supabase.rpc('admin_add_person', {
      person_name: cleanName,
    });

    setSaving(false);

    if (error) {
      setAdminError('Kunde inte lägga till personen: ' + error.message);
      return;
    }

    setNewPersonName('');
    setAdminMessage(
      cleanName + ' har lagts till i personregistret och rotationerna.'
    );

    await loadData();
  }

  // Ta bort person via säker databasfunktion
  async function deletePerson(person) {
    const confirmed = window.confirm(
      'Vill du verkligen ta bort ' + person.name +
      ' från personregistret och alla rotationer?'
    );
  
    if (!confirmed) return;
  
    setSaving(true);
    clearAdminMessages();
  
    const { error } = await supabase.rpc('admin_delete_person', {
      person_id: person.id,
    });
  
    if (error) {
      setAdminError('Kunde inte ta bort personen: ' + error.message);
    } else {
      setAdminMessage(person.name + ' har tagits bort.');
      await loadData();
    }
  
    setSaving(false);
  }
  
  // Flytta en person i rotationsordningen
  function movePerson(scheduleId, index, direction) {
    clearAdminMessages();

    setRotationDrafts((previous) => {
      const rotation = [...previous[scheduleId]];
      const newIndex = index + direction;

      if (newIndex < 0 || newIndex >= rotation.length) {
        return previous;
      }

      [rotation[index], rotation[newIndex]] = [
        rotation[newIndex],
        rotation[index],
      ];

      return {
        ...previous,
        [scheduleId]: rotation,
      };
    });
  }

  // Spara rotationsordning
  async function saveRotation(schedule) {
    setSaving(true);
    clearAdminMessages();

    const { error } = await supabase
      .from('responsibilities')
      .update({ rotation: rotationDrafts[schedule.id] })
      .eq('id', schedule.id);

    setSaving(false);

    if (error) {
      setAdminError('Kunde inte spara rotationen: ' + error.message);
      return;
    }

    setAdminMessage('Rotationsordningen har sparats.');
    await loadData();
  }

  // Rendera personens namn i rotationen
  function getRotationNames(schedule) {
    const rotation = rotationDrafts[schedule.id] || [];

    return rotation.map((id) => {
      const person = people.find((p) => p.id === id);
      return person ? person.name : 'Okänd person';
    });
  }

  const currentPeople = schedules.map((schedule) => {
    const rotation = schedule.people || [];
    return rotation.length ? rotation[week % rotation.length] : 'Ingen';
  });

  const nextPeople = schedules.map((schedule) => {
    const rotation = schedule.people || [];
    return rotation.length
      ? rotation[(week + 1) % rotation.length]
      : 'Ingen';
  });

  const wednesday = getWeekDate(week);
  const friday = new Date(wednesday);
  friday.setDate(friday.getDate() + 2);

  const nextWednesday = getWeekDate(week + 1);
  const nextFriday = new Date(nextWednesday);
  nextFriday.setDate(nextFriday.getDate() + 2);

  return (
    <main className="app">
      <style>{styles}</style>

      <div className="container">
        <header className="header">
          <div>
            <div className="logo">✳ MUSIKVECKAN</div>
            <div className="subtitle">ANSVARSFÖRDELNINGEN</div>
          </div>
          <div className="star">✳</div>
        </header>

        <section className="welcome">
          <div className="week-label">
            VECKA {(week % 6) + 1} AV 6
          </div>
          <h1>Lek mä döm!</h1>
          <p>
            {formatDate(wednesday)} – {formatDate(friday)}
          </p>
        </section>

        {/* Inloggning och administration */}
        <section className="admin-area">
          {!user && (
            <div>
              <button
                className="save-button"
                onClick={() => setShowLogin(!showLogin)}
              >
                {showLogin ? 'Stäng inloggning' : 'Admininloggning'}
              </button>

              {showLogin && (
                <form className="login-form" onSubmit={handleLogin}>
                  <h3>Administratörsinloggning</h3>

                  <input
                    className="login-input"
                    type="email"
                    placeholder="E-postadress"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />

                  <input
                    className="login-input"
                    type="password"
                    placeholder="Lösenord"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />

                  {loginError && (
                    <p className="login-error">{loginError}</p>
                  )}

                  <button
                    className="login-button"
                    type="submit"
                    disabled={loginLoading}
                  >
                    {loginLoading ? 'Loggar in...' : 'Logga in'}
                  </button>
                </form>
              )}
            </div>
          )}

          {user && (
            <div className="admin-status">
              <strong>Inloggad:</strong> {user.email}

              <div style={{ marginTop: 10 }}>
                {isAdmin ? (
                  <>
                    <strong>Administratörsbehörighet aktiv</strong>

                    <div style={{ marginTop: 12 }}>
                      <button
                        className="login-button"
                        onClick={() => setAdminOpen(!adminOpen)}
                      >
                        {adminOpen ? 'Stäng administration' : 'Öppna administration'}
                      </button>
                    </div>
                  </>
                ) : (
                  <p>Kontot saknar administratörsbehörighet.</p>
                )}

                <button
                  className="small-button"
                  style={{ marginTop: 12 }}
                  onClick={handleLogout}
                >
                  Logga ut
                </button>
              </div>
            </div>
          )}

          {adminOpen && isAdmin && (
            <div className="admin-panel">
              <h2>Administration</h2>

              <div className="admin-tabs">
                <button
                  className={'tab-button ' + (adminTab === 'people' ? 'active' : '')}
                  onClick={() => setAdminTab('people')}
                >
                  Personer
                </button>

                <button
                  className={'tab-button ' + (adminTab === 'rotation' ? 'active' : '')}
                  onClick={() => setAdminTab('rotation')}
                >
                  Rotationer
                </button>
              </div>

              {adminMessage && (
                <div className="admin-message">{adminMessage}</div>
              )}

              {adminError && (
                <div className="admin-error">{adminError}</div>
              )}

              {adminTab === 'people' && (
                <div className="admin-section">
                  <h3>Personregister</h3>

                  {people.map((person) => (
                    <div className="person-row" key={person.id}>
                      <input
                        aria-label={'Namn på ' + person.name}
                        defaultValue={person.name}
                        onBlur={(e) => {
                          if (e.target.value.trim() !== person.name) {
                            renamePerson(person, e.target.value);
                          }
                        }}
                        disabled={saving}
                      />

                      <button
                        className="small-button delete-button"
                        onClick={() => deletePerson(person)}
                        disabled={saving}
                      >
                        Ta bort
                      </button>
                    </div>
                  ))}

                  <form className="add-row" onSubmit={addPerson}>
                    <input
                      type="text"
                      placeholder="Nytt namn"
                      value={newPersonName}
                      onChange={(e) => setNewPersonName(e.target.value)}
                      disabled={saving}
                    />

                    <button
                      className="login-button"
                      type="submit"
                      disabled={saving}
                    >
                      Lägg till
                    </button>
                  </form>

                  <p className="info-text">
                    När en person läggs till uppdateras rotationerna via
                    databasfunktionen. Namn kan ändras direkt i listan.
                  </p>
                </div>
              )}

              {adminTab === 'rotation' && (
                <div className="admin-section">
                  <h3>Ändra rotationsordning</h3>

                  {schedules.map((schedule) => {
                    const names = getRotationNames(schedule);

                    return (
                      <div key={schedule.id} className="admin-section">
                        <h3>{schedule.name}</h3>

                        {(rotationDrafts[schedule.id] || []).map(
                          (personId, index) => {
                            const person = people.find(
                              (p) => p.id === personId
                            );

                            return (
                              <div className="rotation-row" key={personId}>
                                <span className="rotation-name">
                                  {index + 1}. {person?.name || 'Okänd person'}
                                </span>

                                <button
                                  className="small-button"
                                  disabled={index === 0 || saving}
                                  onClick={() =>
                                    movePerson(schedule.id, index, -1)
                                  }
                                >
                                  ↑
                                </button>

                                <button
                                  className="small-button"
                                  disabled={
                                    index === names.length - 1 || saving
                                  }
                                  onClick={() =>
                                    movePerson(schedule.id, index, 1)
                                  }
                                >
                                  ↓
                                </button>
                              </div>
                            );
                          }
                        )}

                        <button
                          className="login-button"
                          disabled={saving}
                          onClick={() => saveRotation(schedule)}
                        >
                          {saving ? 'Sparar...' : 'Spara rotation'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </section>

        {/* Veckoschemat */}
        {loading && (
          <div className="message">Hämtar veckans schema... ⏳</div>
        )}

        {error && (
          <div className="message">
            <strong>Något gick fel</strong>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && schedules.length === 0 && (
          <div className="message">
            Inga ansvarsområden hittades i databasen.
          </div>
        )}

        {!loading && !error && schedules.map((schedule, index) => (
          <section
            className="card"
            key={schedule.id}
            style={{
              background: schedule.color,
              color: schedule.text,
            }}
          >
            <div className="day-row">
              <div className="day">
                {schedule.name === 'Onsdagsdeppet'
                  ? 'ONSDAG'
                  : schedule.name === 'Albumsläppet'
                  ? 'TORSDAG'
                  : 'FREDAG'}
              </div>
              <div className="emoji">{schedule.emoji}</div>
            </div>

            <div className="responsibility">{schedule.name}</div>
            <hr />
            <div className="person">{currentPeople[index]}</div>
          </section>
        ))}

        {!loading && !error && schedules.length > 0 && (
          <>
            <section className="next">
              <div className="next-label">NÄSTA VECKA</div>
              <h2>Vem står på tur?</h2>
              <div className="next-people">
                {nextPeople.join(' · ')}
              </div>
              <div className="next-date">
                {formatDate(nextWednesday)} – {formatDate(nextFriday)}
              </div>
            </section>

            <div className="navigation">
              <button
                className="nav-button"
                disabled={week === 0}
                onClick={() => setWeek(week - 1)}
              >
                ← Bakåt
              </button>

              <div className="nav-title">Vecka {week + 1}</div>

              <button
                className="nav-button"
                onClick={() => setWeek(week + 1)}
              >
                Framåt →
              </button>
            </div>
          </>
        )}

        <div className="footer">
          EN LITEN DOS ORDNING I VECKOKAOS ✳
        </div>
      </div>
    </main>
  );
}

export default App;
