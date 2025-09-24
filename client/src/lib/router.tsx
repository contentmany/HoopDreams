import React, {
  AnchorHTMLAttributes,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";

type NavigateOptions = { replace?: boolean; state?: unknown };
type RouterContextValue = { path: string; navigate: (to: string | number, options?: NavigateOptions) => void };

const RouterContext = createContext<RouterContextValue | null>(null);

function getPath(){
  if (typeof window === "undefined") return "/";
  return window.location.pathname || "/";
}

export function BrowserRouter({ children }: { children: ReactNode }){
  const [path, setPath] = useState<string>(()=>getPath());
  useEffect(()=>{
    if (typeof window === "undefined") return;
    const handle=()=>setPath(getPath());
    window.addEventListener("popstate", handle);
    return ()=>window.removeEventListener("popstate", handle);
  },[]);
  const navigate = useCallback((to: string | number, options?: NavigateOptions)=>{
    if (typeof window === "undefined") return;
    if (typeof to === "number"){ window.history.go(to); return; }
    const target = to.startsWith("/") ? to : `/${to}`;
    if (options?.replace){ window.history.replaceState(options.state ?? null, "", target); }
    else { window.history.pushState(options.state ?? null, "", target); }
    setPath(getPath());
  },[]);
  const value = useMemo(()=>({ path, navigate }), [path, navigate]);
  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

function useRouter(){
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error("Router context missing");
  return ctx;
}

type RouteProps = { path: string; element: ReactNode };
export function Route(_props: RouteProps){ return null; }

function matchPath(routePath: string, current: string){
  if (routePath === "*") return true;
  if (routePath.endsWith("/*")){
    const base = routePath.slice(0,-2);
    return current === base || current.startsWith(`${base}/`);
  }
  return routePath === current;
}

export function Routes({ children }: { children: ReactNode }){
  const { path } = useRouter();
  let element: ReactNode = null;
  React.Children.forEach(children, child => {
    if (element !== null) return;
    if (!React.isValidElement<RouteProps>(child)) return;
    if (matchPath(child.props.path, path)){
      element = child.props.element;
    }
  });
  return <>{element}</>;
}

export function Navigate({ to, replace }: { to: string; replace?: boolean }){
  const { navigate } = useRouter();
  useEffect(()=>{ navigate(to, { replace }); },[navigate,to,replace]);
  return null;
}

export function useNavigate(){
  const { navigate } = useRouter();
  return useCallback((to: string | number, options?: NavigateOptions)=>navigate(to, options), [navigate]);
}

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { to: string; replace?: boolean };
export function Link({ to, replace, onClick, href, ...rest }: LinkProps){
  const navigate = useNavigate();
  const handleClick: React.MouseEventHandler<HTMLAnchorElement> = (event)=>{
    if (onClick) onClick(event);
    if (event.defaultPrevented) return;
    if (event.button !== 0 || event.metaKey || event.altKey || event.ctrlKey || event.shiftKey) return;
    event.preventDefault();
    navigate(to, { replace });
  };
  return <a {...rest} href={href ?? to} onClick={handleClick}/>;
}

type NavLinkClass = string | ((state:{isActive:boolean})=>string);
type NavLinkProps = Omit<LinkProps, "className"> & { className?: NavLinkClass };
export function NavLink({ className, ...rest }: NavLinkProps){
  const { path } = useRouter();
  const isActive = path === (rest.to.startsWith("/") ? rest.to : `/${rest.to}`);
  const classValue = typeof className === "function" ? className({isActive}) : className;
  return <Link {...rest} className={classValue ?? undefined}/>;
}
