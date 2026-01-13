import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className="bg-slate-800 text-white p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-xl font-bold">TaskMaster</h1>
                <div className="space-x-4">
                    <Link href="/" className='hover:text-slate-300 transition-colors'>
                      Home
                    </Link>
                    <Link href="/tasks" className='hover:text-slate-300 transition-colors'>
                      Tasks
                    </Link>
                    <Link href="/settings" className='hover:text-slate-300 transition-colors'>
                      Settings
                    </Link>
                </div>
            </div>
        </nav>
    );
}