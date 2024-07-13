import { useLogto } from '@logto/react';

const Home = () => {
  const { signIn, signOut, isAuthenticated } = useLogto();

  return isAuthenticated ? (
    <button onClick={() => signOut('http://localhost:3000/')}>Sign Out</button>
  ) : (
    <button onClick={() => signIn('http://localhost:3000/Dashboard')}>Sign In</button>
  );
};

export default Home;