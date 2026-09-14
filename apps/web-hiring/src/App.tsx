import { Navbar } from '@repo/ui/navbar'

function App() {
  const className = 'flex p-6 justify-evenly'
  return (
    <>
    <Navbar title='ATS' searchPlaceholder='Search...' className={className} showSearch={true} userName='' authState={'Logout'}/>
    </>
  )
}

export default App;