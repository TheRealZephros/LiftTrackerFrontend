import React from 'react'
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuth } from '../../Context/useAuth';
import { useForm } from 'react-hook-form';

type LoginFormInputs = {
    email: string,
    password: string
}

const validation = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
        .required("Password is required")
        .min(8, "Password must be at least 8 characters")
        .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .matches(/\d/, 'Password must contain at least one number')
});

const LoginPage = () => {
    const { loginUser } = useAuth();
    const { register,
        handleSubmit,
        formState: { errors } 
    } = useForm<LoginFormInputs>({ resolver: yupResolver(validation) });

    const handleLogin = (form: LoginFormInputs) => {
        loginUser(form.email, form.password);
    };

  return (
     <section className="bg-bg1">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full rounded-lg shadow  md:mb-20 sm:max-w-md xl:p-0 bg-bg2 border-bg3">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-text1 md:text-2xl">
              Sign in to your account
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(handleLogin)}>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-text1 text-text1"
                >
                  Email
                </label>
                <input
                  type="text"
                  id="email"
                  className="border text-text1 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-bg3 border-bg4 placeholder-text3 text-text1 focus:ring-buttonEdit2 focus:border-buttonEdit2"
                  placeholder="Email"
                  {...register("email")}
                />
                {errors.email ? <p className="text-buttonDelete2">{errors.email.message}</p> : ""}
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-text1 text-text1"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  className="border text-text1 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-bg3 border-bg4 placeholder-text3 text-text1 focus:ring-buttonEdit2 focus:border-buttonEdit2"
                  {...register("password")}
                />
                {errors.password ? <p className="text-buttonDelete2">{errors.password.message}</p> : ""}
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  className="text-sm text-text1 font-medium text-primary-600 hover:underline text-primary-500 bg-transparent p-0"
                  aria-label="Forgot password?"
                  // TODO: Add onClick handler for forgot password functionality
                >
                  Forgot password?
                </button>
              </div>
              <button
                type="submit"
                className="w-full text-text1 bg-button1 hover:bg-button2 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Sign in
              </button>
              <p className="text-sm font-light text-text3">
                Don’t have an account yet?{" "}
                <button
                  type="button"
                  className="font-medium text-text3 hover:underline bg-transparent p-0"
                  // TODO: Add onClick handler for sign up navigation
                  aria-label="Sign up"
                >
                  Sign up
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default LoginPage
