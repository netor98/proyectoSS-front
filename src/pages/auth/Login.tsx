
import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import React from "react";
import { UserContext } from "../../context/userContext";


function Login() {
	const { user, setUser } = useContext(UserContext);
	const navigate = useNavigate();

	useEffect(() => {
		if (user) {
			navigate("/dashboard");
		}
	}, [user, navigate]);

	const [data, setData] = useState({
		email: "",
		password: "",
	});

	//NOTE: This is the loading state
	const [loading, setLoading] = useState(false);



	const loginUser = async (e) => {
		e.preventDefault();
		setLoading(true);


		const { email, password } = data;
		try {
			const response = await axios.post(
				"http://localhost:8000/api/auth/token",
				{ email, password },
				{ withCredentials: true }
			);
			await new Promise(resolve => setTimeout(resolve, 2000));

			if (response.data.error) {
				toast.error(response.data.error);
			} else {
				setData({ email: "", password: "" });
				navigate("/dashboard");
			}
		} catch (error) {

			await new Promise(resolve => setTimeout(resolve, 2000));
			toast.error("Credenciales incorrectas", {
				style: {
					borderRadius: "10px",
					background: "#333",
					color: "#fff",
				},
				duration: 2700,
			});
			setData({ ...data, password: "" });
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="font-roboto">
			<div className="flex justify-baseline items-center">
				<img src="/uas_logo.png" alt="BufetePDFReaderLogo" className="h-16 w-auto mb-3" />
				<h3 className="text-xl text-neutral-500 font-semibold">Nombre</h3>
			</div>
			<h2 className="text-4xl font-semibold mb-6 font-roboto">Iniciar sesión</h2>
			<form className="space-y-4" onSubmit={loginUser}>
				<div>
					<label className="block text-sm font-medium text-gray-600" htmlFor="email">
						Correo electrónico
					</label>

					<input
						id="email"
						type="text"
						placeholder="correo@ejemplo.com"
						value={data.email}
						onChange={(e) => setData({ ...data, email: e.target.value })}
						className={`w-full p-2 mt-1 border-2 border-gray-300 rounded-lg bg-gray-50
              focus:outline-none focus:ring-1 focus:border-slate-500 focus:ring-slate-500 

				      ${loading ? "opacity-30 cursor-not-allowed" : ""}`} />
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-600" htmlFor="password">
						Contraseña
					</label>
					<input
						id="password"
						type="password"
						placeholder="*******"
						value={data.password}
						onChange={(e) => setData({ ...data, password: e.target.value })}
						className={`w-full p-2 mt-1 border-2 border-gray-300 rounded-lg bg-gray-50
              focus:outline-none focus:ring-1 focus:border-slate-500 focus:ring-slate-500
				      ${loading ? "opacity-30 cursor-not-allowed" : ""}`}
					/>
				</div>
				<div className="flex items-center justify-between">
					<div className="flex items-center">
						<input id="remember" type="checkbox" className="w-4 h-4 mr-2 accent-slate-700" />
						<label className="text-sm" htmlFor="remember">
							Recuérdame
						</label>
					</div>
					<a className="text-sm font-semibold secondary-text no-underline link-underline">
						<Link to="/">¿Olvidaste tu contraseña?</Link>
					</a>
				</div>
				<button
					type="submit"
					disabled={loading}
					className={`w-full p-2 mt-2 font-bold text-white cursor-pointer btn-main-color rounded-lg 
								transition-colors duration-300 
								${loading ? "opacity-50 cursor-not-allowed" : ""
						}`}
				>
					{loading ? "Iniciando sesión..." : "Iniciar sesión"}
				</button>
			</form>
			<p className="text-sm mt-7 mb-7 text-center">
				¿No tienes una cuenta?
				<Link to="/auth/register" className="ml-1 secondary-text font-bold no-underline link-underline">
					Registrarme
				</Link>
			</p>
		</div>
	);
}

export default Login;
