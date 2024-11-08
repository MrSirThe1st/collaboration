import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "@/redux/authSlice";
import { Loader2 } from "lucide-react";
import AvatarUi from "../customUI/avatarUi.jsx";

const Signup = () => {
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: "",
    file: null,
    profession: "",
  });
  const [avatarUrl, setAvatarUrl] = useState(null);
  const { loading, user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const changeFileHandler = (file) => {
    setInput({ ...input, file: file });
    setAvatarUrl(URL.createObjectURL(file));
  };

  const handleProfessionChange = (profession) => {
    setInput({ ...input, profession: profession });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("username", input.username);
    formData.append("email", input.email);
    formData.append("password", input.password);
    formData.append("profession", input.profession);
    if (input.file) {
      formData.append("file", input.file);
    }

    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      if (res.data.success) {
        // After successful registration, immediately log in the user
        const loginRes = await axios.post(
          `${USER_API_END_POINT}/login`,
          {
            email: input.email,
            password: input.password,
          },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );

        if (loginRes.data.success) {
          dispatch(setUser(loginRes.data.user));
          navigate("/");
          toast.success("Account created and logged in successfully");
        } else {
          throw new Error("Login after signup failed");
        }
      } else {
        throw new Error(res.data.message || "Signup failed");
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message || error.message || "An error occurred"
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, []);

  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center max-w-7xl mx-auto">
        <form
          onSubmit={submitHandler}
          className="w-1/2 border border-gray-200 rounded-md p-4 my-10"
        >
          <h1 className="font-bold text-xl mb-5">Sign Up</h1>

          <div className="my-2">
            <Label>Username</Label>
            <Input
              type="text"
              value={input.username}
              name="username"
              onChange={changeEventHandler}
              placeholder="********"
            />
          </div>
          <div className="my-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={input.email}
              name="email"
              onChange={changeEventHandler}
              placeholder="********"
            />
          </div>

          <div className="my-2">
            <Label>Profile</Label>
            <AvatarUi
              avatarUrl={avatarUrl}
              onFileChange={changeFileHandler}
              onProfessionChange={handleProfessionChange}
              selectedProfession={input.profession}
            />
          </div>
          <div className="my-2">
            <Label>Password</Label>
            <Input
              type="password"
              value={input.password}
              name="password"
              onChange={changeEventHandler}
              placeholder="password"
            />
          </div>
          {loading ? (
            <Button className="w-full my-4">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
            </Button>
          ) : (
            <Button type="submit" className="w-full my-4">
              Signup
            </Button>
          )}
          <span className="text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600">
              Login
            </Link>
          </span>
        </form>
      </div>
    </div>
  );
};

export default Signup;
