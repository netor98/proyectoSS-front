import { Link } from "react-router-dom"

function Login() {

	return (
		<>
			<div className="font-roboto">
				<div className="flex justify-baseline items-center">
					<img src="/uas_logo.png" alt="BufetePDFReaderLogo" className="h-16 w-auto mb-3" />
					<h3 className="text-xl text-neutral-500 font-semibold">Nombre</h3>
				</div>
				<h2 className="text-4xl font-semibold mb-6 font-roboto">Iniciar sesión</h2>

				<form className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-gray-600" htmlFor="emailOrUsername">Correo electrónico</label>
						<input id="emailOrUsername" type="text" placeholder="correo@ejemplo.com"
							className="w-full p-2 mt-1 border-2 border-gray-300 rounded-lg bg-gray-50
							focus:outline-none focus:ring-1 focus:border-slate-500 focus:ring-slate-500" />
					</div>


					<div>
						<label className="block text-sm font-medium text-gray-600" htmlFor="password">Contraseña</label>
						<input id="password" type="password" placeholder="*******"
							className="w-full p-2 mt-1 border-2 border-gray-300 rounded-lg bg-gray-50
							focus:outline-none focus:ring-1 focus:border-slate-500 focus:ring-slate-500" />
					</div>


					<div className="flex items-center justify-between">

						<div className="flex items-center">
							<input id="remember" type="checkbox" className="w-4 h-4 mr-2 accent-slate-700" />
							<label className="text-sm" htmlFor="remember">Recuérdame</label>
						</div>

						<a className="text-sm font-semibold secondary-text no-underline link-underline">
							<Link to="/">¿Olvidaste tú
								contraseña?
							</Link>
						</a>

					</div>

					<button
						className="w-full p-2 mt-2 font-bold text-white cursor-pointer
						btn-main-color rounded-lg transition-colors duration-300">
						Iniciar sesión
					</button>
				</form>


				<p className="text-sm mt-7 mb-7 text-center">
					¿No tienes una cuenta?
					<Link to="/auth/register" className="ml-1 secondary-text font-bold no-underline link-underline">
						Registrarme
					</Link>
				</p>
			</div>
		</>
	)
}


export default Login

