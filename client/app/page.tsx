import Hero from '@/components/Hero'
import ModuleCards from '@/components/ModuleCards'
import RegionExplorer from '@/components/RegionExplorer'
import FeaturedWord from '@/components/FeaturedWord'
import RightRail from '@/components/RightRail'
import Welcome from '@/components/Welcome'
// Two aligned columns on wide screens: [shortcuts | call to action] over [region explorer | featured word].
// On smaller screens everything stacks (the call to action moves to the end via `order-last`).
export default function Home() {
 return (<><Welcome /><Hero /><div className="grid gap-5 p-5 xl:grid-cols-[minmax(0,1fr)_320px]"><ModuleCards /><RightRail /><RegionExplorer /><FeaturedWord /></div></>)
}
