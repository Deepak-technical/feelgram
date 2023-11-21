import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link,useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast"

// import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Loader from "@/components/shared/Loader";
import { SignupValidation } from "@/lib/validation";
import { useCreateuserAccount, useSignInAccount } from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from "@/context/AuthContext";



const SignUpForm = () => {
  const { toast } = useToast();
  const navigate=useNavigate();
  const {mutateAsync: createUserAccount,isLoading:isCreatingUser}=useCreateuserAccount();
  const {mutateAsync:signInAccount,isLoading:isSigningIn}=useSignInAccount();
  const {checkAuthUser,isLoading:isUserLoading}=useUserContext();


  // const isLoading = false;
  // 1. Define your form.
  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });
  // 2. Define a submit handler.
  async function handleSignup(values: z.infer<typeof SignupValidation>) {
    const newUser = await createUserAccount(values);
    console.log(newUser);
    if(!newUser){
      toast({
        title: "Sign Up Failed. Please try again later",
      })
    }
    const session = await signInAccount({email:values.email, password:values.password})

    if(!session){
      return toast({title: "Sign Up Failed. Please try again later"});

    }
    const isLoggedIn=await checkAuthUser();

    if(isLoggedIn){
      form.reset();
      navigate('/');
    }
    else{
      return toast({title: "Sign Up Failed. Please try again later"});
    }


  }
  return (
    <>
      <Form {...form}>
        <div className="sm:w-420 flex-center flex-col ">
          <img src="/public/assets/images/logo.svg" alt="" />
          <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">
            Create an new account
          </h2>
          <p className="text-light-3 small-medium md:base-regular mt-2">
            To use SocialLens enter your details
          </p>

          <form
            onSubmit={form.handleSubmit(handleSignup)}
            className="flex flex-col gap-5 w-full mt-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Name</FormLabel>
                  <FormControl>
                    <Input type="text" className="shad-input" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Username</FormLabel>
                  <FormControl>
                    <Input type="text" className="shad-input" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Email</FormLabel>
                  <FormControl>
                    <Input type="text" className="shad-input" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Password</FormLabel>
                  <FormControl>
                    <Input type="password" className="shad-input" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="shad-button_primary">
              {isCreatingUser ? (
                <div className="flex-center gap-2">
                  <Loader /> Loading...
                </div>
              ) : (
                "Sign Up"
              )}
            </Button>

            <p className="text-small-regular text-light-2 text-center mt-2">
              Already have an account?
              <Link
                to="/sign-in"
                className="text-primary-500 text-small-semibold ml-1"
              >
                Log in
              </Link>
            </p>
          </form>
        </div>
      </Form>
    </>
  );
};

export default SignUpForm;
