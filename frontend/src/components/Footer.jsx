const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-6 mt-10">
            <div className="container mx-auto text-center">
                <p>DevAPIStore &copy; {new Date().getFullYear()}</p>
                <p className="text-sm text-gray-400 mt-2">Todos los derechos reservados</p>
            </div>
        </footer>
    );
};
export default Footer;