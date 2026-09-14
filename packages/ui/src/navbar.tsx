import { type JSX } from 'react';
import { Button } from './button';

export function Navbar( {
   title,
   searchPlaceholder,
   showSearch,
   className,
   userName,
   authState
}: {
    title: string,
    searchPlaceholder: string,
    showSearch: boolean,
    className: string,
    userName: string,
    authState: string

}): JSX.Element {
    return (
        <div>
            <div className={className}>

            {title}

            { showSearch && 
            <span>
                <input type="search" placeholder={searchPlaceholder}/>
            </span>
            }
            </div>


            <div>
                <Button appName={authState === 'Logout' ? `You are logged-in as ${userName}` : 'Please log-in!'}
                 children={authState}/>
            </div>
        </div>
    )
}