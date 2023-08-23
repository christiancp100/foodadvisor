import React from 'react';
import { useFormik } from 'formik';
import { Button, Input } from '@nextui-org/react';
import Layout from '../../components/layout';
import { getStrapiURL } from '../../utils';

const Login = ({ global, preview }) => {
  const { handleSubmit, handleChange } = useFormik({
    initialValues: {
      identifier: '',
      password: '',
    },
    onSubmit: async (values) => {
      const res = await fetch(getStrapiURL('/auth/local'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      const { jwt } = await res.json();
      localStorage.setItem('token', jwt);
    },
  });
  return (
    <Layout global={global} preview={preview}>
      <div className="h-full w-full flex justify-center items-center my-24">
        <form onSubmit={handleSubmit} className="flex flex-col gap-y-6 w-4/12 ">
          <h1 className="font-bold text-3xl mb-6">Login</h1>
          <Input
            onChange={handleChange}
            type="email"
            name="identifier"
            label="Email"
            placeholder="Enter your email"
          />
          <Input
            type="password"
            name="password"
            label="Password"
            placeholder="Enter your password"
            onChange={handleChange}
          />
          <Button type="submit" className="bg-primary rounded-md text-muted">
            Login
          </Button>
        </form>
      </div>
    </Layout>
  );
};

export default Login;
