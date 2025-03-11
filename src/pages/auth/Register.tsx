import axios from "axios";
import { useState } from "react"
import toast from "react-hot-toast";
import { Link } from "react-router-dom"

function Register() {
	const [data, setData] = useState({
		first_names: "",
		last_names: "",
		email: "",
		employeeNumber: "",
		phoneNumber: "",
		hashed_password: "",
		confirmPassword: ""
	})

	const registerUser = async (e) => {
		e.preventDefault();
		const { first_names, last_names, email, employeeNumber, phoneNumber, hashed_password, confirmPassword } = data;


		try {
			const { data } = await axios.post('http://localhost:8000/api/auth/register', {
				first_names, last_names, email, employeeNumber, phoneNumber, hashed_password, confirmPassword
			})
			console.log(data)
			setData({})
			toast.success('Registro exitoso')
		} catch (error) {
			toast.error(error.response.data.detail);
			setData({ email: "", hashed_password: "", confirmPassword: "" })
		}
	}

	return (

		<div className="font-roboto">

			<div className="flex justify-baseline items-center">
				<img src="/uas_logo.png" alt="BufetePDFReaderLogo" className="h-16 w-auto mb-3" />
				<h3 className="text-xl text-neutral-500 font-semibold">Nombre</h3>
			</div>
			<h2 className="text-4xl font-bold mb-6">Registrarme</h2>

			<form className="space-y-4" onSubmit={registerUser}>

				<div className="flex justify-between gap-3">
					<div>
						<label className="block text-sm font-medium text-gray-600" htmlFor="names">Nombres</label>
						<input id="names" type="text" placeholder="Nombres" value={data.first_names}
							onChange={(e) => setData({ ...data, first_names: e.target.value })}
							className="w-full p-2 mt-1 border-2 border-gray-300 rounded-lg bg-gray-50
						focus:outline-none focus:ring-1 focus:border-slate-500 focus:ring-slate-500" />
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-600" htmlFor="lastnames">Apellidos</label>
						<input id="lastnames" type="text" placeholder="Apellidos" value={data.last_names}
							onChange={(e) => setData({ ...data, last_names: e.target.value })}
							className="w-full p-2 mt-1 border-2 border-gray-300 bg-gray-50
						rounded-lg focus:outline-none focus:ring-1 focus:border-slate-500 focus:ring-slate-500" />
					</div>

				</div>

				<div>
					<label className="block text-sm font-medium text-gray-600" htmlFor="email">Correo electrónico</label>
					<input id="email" type="email" placeholder="correo@ejemplo.com" value={data.email}
						onChange={(e) => setData({ ...data, email: e.target.value })}
						className="w-full p-2 mt-1 border-2 border-gray-300 rounded-lg focus:outline-none 
						focus:ring-1 focus:border-slate-500 focus:ring-slate-500 bg-gray-50" />
				</div>

				<div className="flex justify-between gap-3">
					<div>
						<label className="block text-sm font-medium text-gray-600" htmlFor="employeeNumber">Núm. Empleado</label>
						<input id="employeeNumber" type="text" placeholder="12345678-9" value={data.employeeNumber}
							onChange={(e) => setData({ ...data, employeeNumber: e.target.value })}
							className="w-full p-2 mt-1 border-2 border-gray-300 rounded-lg bg-gray-50
						focus:outline-none focus:ring-1 focus:border-slate-500 focus:ring-slate-500" />
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-600" htmlFor="phoneNumber">Núm. Teléfonico</label>
						<input id="phoneNumber" type="text" placeholder="6681566734" value={data.phoneNumber}
							onChange={(e) => setData({ ...data, phoneNumber: e.target.value })}
							className="w-full p-2 mt-1 border-2 border-gray-300 bg-gray-50
						rounded-lg focus:outline-none focus:ring-1 focus:border-slate-500 focus:ring-slate-500" />
					</div>

				</div>


				<div>
					<label className="block text-sm font-medium text-gray-600" htmlFor="password">Contraseña</label>
					<input id="password" type="password" placeholder="*******" value={data.hashed_password}
						onChange={(e) => setData({ ...data, hashed_password: e.target.value })}
						className="w-full p-2 mt-1 border-2 border-gray-300 rounded-lg bg-gray-50
							focus:outline-none focus:ring-1 focus:border-slate-500 focus:ring-slate-500" />
				</div>


				<div>
					<label className="block text-sm font-medium text-gray-600" htmlFor="confirmPassword">Confirmar Contraseña</label>
					<input id="confirmPassword" type="password" placeholder="*******" value={data.confirmPassword}
						onChange={(e) => setData({ ...data, confirmPassword: e.target.value })}
						className="w-full p-2 mt-1 border-2 border-gray-300 rounded-lg bg-gray-50
							focus:outline-none focus:ring-1 focus:border-slate-500 focus:ring-slate-500" />
				</div>

				<button
					className="w-full p-2 mt-2 mb-4 font-semibold text-white btn-main-color 
					rounded-lg transition-colors duration-300">
					Registrarse
				</button>
			</form>


			<p className="text-sm mt-7 text-center">
				¿Ya tienes una cuenta?
				<Link to="/auth/login" className="ml-1 secondary-text cursor-pointer font-bold no-underline link-underline">
					Iniciar sesión
				</Link>
			</p>
		</div>

	)
}

export default Register
