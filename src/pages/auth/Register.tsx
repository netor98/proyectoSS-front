import { Link } from "react-router-dom"

function Register() {
	return (

		<div className="font-roboto">

			<div className="flex justify-baseline items-center">
				<img src="/uas_logo.png" alt="BufetePDFReaderLogo" className="h-16 w-auto mb-3" />
				<h3 className="text-xl text-neutral-500 font-semibold">Nombre</h3>
			</div>
			<h2 className="text-4xl font-bold mb-6">Registrarme</h2>

			<form className="space-y-4">

				<div className="flex justify-between gap-3">
					<div>
						<label className="block text-sm font-medium text-gray-600" htmlFor="names">Nombres</label>
						<input id="names" type="text" placeholder="Nombres"
							className="w-full p-2 mt-1 border-2 border-gray-300 rounded-lg bg-gray-50
						focus:outline-none focus:ring-1 focus:border-slate-500 focus:ring-slate-500" />
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-600" htmlFor="lastnames">Apellidos</label>
						<input id="lastnames" type="text" placeholder="Apellidos"
							className="w-full p-2 mt-1 border-2 border-gray-300 bg-gray-50
						rounded-lg focus:outline-none focus:ring-1 focus:border-slate-500 focus:ring-slate-500" />
					</div>

				</div>

				<div>
					<label className="block text-sm font-medium text-gray-600" htmlFor="email">Correo electrónico</label>
					<input id="names" type="email" placeholder="correo@ejemplo.com"
						className="w-full p-2 mt-1 border-2 border-gray-300 rounded-lg focus:outline-none 
						focus:ring-1 focus:border-slate-500 focus:ring-slate-500 bg-gray-50" />
				</div>

				<div className="flex justify-between gap-3">

					<div>
						<label className="block text-sm font-medium text-gray-600" htmlFor="names">Núm. Empleado</label>
						<input id="employeeNumber" type="text" placeholder="12345678-9"
							className="w-full p-2 mt-1 border-2 border-gray-300 rounded-lg bg-gray-50
						focus:outline-none focus:ring-1 focus:border-slate-500 focus:ring-slate-500" />
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-600" htmlFor="lastnames">Núm. Teléfonico</label>
						<input id="lastnames" type="text" placeholder="6681566734"
							className="w-full p-2 mt-1 border-2 border-gray-300 bg-gray-50
						rounded-lg focus:outline-none focus:ring-1 focus:border-slate-500 focus:ring-slate-500" />
					</div>

				</div>


				<div>
					<label className="block text-sm font-medium text-gray-600" htmlFor="password">Contraseña</label>
					<input id="password" type="password" placeholder="*******"
						className="w-full p-2 mt-1 border-2 border-gray-300 rounded-lg bg-gray-50
							focus:outline-none focus:ring-1 focus:border-slate-500 focus:ring-slate-500" />
				</div>


				<div>
					<label className="block text-sm font-medium text-gray-600" htmlFor="password">Confirmar Contraseña</label>
					<input id="password" type="password" placeholder="*******"
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
