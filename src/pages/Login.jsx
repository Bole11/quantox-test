import { useContext, useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthContext } from "../context/AuthContext.jsx";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "../components/Header.jsx";
import styles from "../styles/Login.module.css";

const schema = z.object({
    username: z.string().min(6, "Minimum 6 characters"),
    password: z.string().min(6, "Minimum 6 characters"),
});

export function Login() {
    const { login, user } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema),
    });

    const onFormSubmit = async (formData) => {
        setIsLoading(true);
        try {
            await login({
                username: formData.username,
                password: formData.password
            });
            
        navigate('/home');
        } catch (error) {
            console.log("Login error:", error);
            alert("Login failed. Please check your credentials.");
        } finally {
            setIsLoading(false);
        }
    };

    if (user) {
        return (
            <>
                <Header />
                <Link 
                    to={"/home"} 
                    className={styles.continueButton}
                >Continue to homepage</Link>
            </>
        )
    }

    return (
        <div className={styles.loginContainer}>
            <Header />
            <form onSubmit={handleSubmit(onFormSubmit)} className={styles.loginForm}>
                <h2 className={styles.formTitle}>Log in to your account</h2>

                 <div className={styles.formGroup}>
                    <label htmlFor="username" className={styles.formLabel}></label>
                    <input
                        type="text"
                        id="username"
                        className={styles.formInput}
                        {...register('username')}
                        placeholder="Username"
                    />
                    {errors.username && <span className={styles.errorMessage}>{errors.username.message}</span>}
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="password" className={styles.formLabel}></label>
                    <input
                        type="password"
                        id="password"
                        className={styles.formInput}
                        {...register('password')}
                        placeholder="Password"
                    />
                    {errors.password && <span className={styles.errorMessage}>{errors.password.message}</span>}
                 </div>

                <button 
                    type="submit" 
                    className={styles.submitButton}
                    disabled={isLoading}
                    >
                    {isLoading ? "Loggin in..." : "Log in"}
                </button>
            </form>
        </div>
    )
};