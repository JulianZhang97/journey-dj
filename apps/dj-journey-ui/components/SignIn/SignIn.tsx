import styles from '../pages/index.module.scss';
import SignInButton from './SignInButton';

interface SignInProps {
    accessToken: string;
  }
  

export function SignIn(props: SignInProps) {
    const { accessToken } = props; 

    return (
        <div>
            {accessToken ? <h1>Signed in to Spotify!</h1> : <SignInButton/> }
        </div>
    );
}

export default SignIn;
