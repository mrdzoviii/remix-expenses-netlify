import {
  Form,
  Link,
  useActionData,
  useNavigation,
  useSearchParams,
} from "@remix-run/react";
import { FaLock, FaUserPlus } from "react-icons/fa";

export default function AuthForm() {
  const [searchParams] = useSearchParams();
  const navigation = useNavigation();

  const validationErrors = useActionData();

  const authMode = searchParams.get("mode") || "login";

  const submitButtonCaption = authMode === "login" ? "Login" : "Create user";
  const toggleButtonCaption =
    authMode === "login" ? "Create a new user" : "Login with existing user";

  const isSubmitting = navigation.state !== "idle";
  return (
    <Form method="post" className="form" id="auth-form" autoComplete="off">
      <div className="icon-img">
        {authMode === "login" ? <FaLock /> : <FaUserPlus />}
      </div>
      <p>
        <label htmlFor="email">Email Address</label>
        <input
          type="email"
          id="email"
          name="email"
          required
          data-lpignore="true"
        />
      </p>
      <p>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          minLength={7}
          data-lpignore="true"
        />
      </p>
      {validationErrors ? (
        <ul>
          {Object.values<string>(validationErrors).map((err) => (
            <li key={err}>{err}</li>
          ))}
        </ul>
      ) : null}
      <div className="form-actions">
        <button disabled={isSubmitting}>
          {isSubmitting ? "Authenticating..." : submitButtonCaption}
        </button>
        <Link to={authMode === "login" ? "?mode=signup" : "?mode=login"}>
          {toggleButtonCaption}
        </Link>
      </div>
    </Form>
  );
}
