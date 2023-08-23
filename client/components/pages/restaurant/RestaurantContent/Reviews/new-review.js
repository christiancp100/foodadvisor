import { Button, Input, Textarea } from '@nextui-org/react';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import React from 'react';
import { getStrapiURL } from '../../../../../utils';
import toast from 'react-hot-toast';

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
  }
}

const NewReview = () => {
  const router = useRouter();

  const { handleSubmit, handleChange, values } = useFormik({
    initialValues: {
      note: '',
      content: '',
    },
    onSubmit: async (values) => {
      try {
        const res = await fetch(getStrapiURL('/reviews'), {
          method: 'POST',
          body: JSON.stringify({
            restaurant: router.query.slug,
            ...values,
          }),
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        });

        const { data, error } = await res.json();
        if (error) {
          throw new UnauthorizedError(error.message);
        }
        toast.success('Review created!');
        return data;
      } catch (err) {
        toast.error(err.message);
        console.error(err);
      }
    },
  });
  return (
    <div className="my-6">
      <h1 className="font-bold text-2xl mb-3">Write your review</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
        <Input
          onChange={handleChange}
          name="note"
          type="number"
          min={1}
          max={5}
          label="Stars"
        />
        <Textarea
          name="content"
          onChange={handleChange}
          placeholder="What do you think about this restaurant?"
        />
        <Button
          type="submit"
          className="bg-primary text-white rounded-md self-start"
        >
          Send
        </Button>
      </form>
    </div>
  );
};

export default NewReview;
