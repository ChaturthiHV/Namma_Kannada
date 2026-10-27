import Hero from '@/components/Hero'
import ModuleCards from '@/components/ModuleCards'
import RegionExplorer from '@/components/RegionExplorer'
import FeaturedWord from '@/components/FeaturedWord'
import RightRail from '@/components/RightRail'
import Welcome from '@/components/Welcome'
import Stories from '@/components/Stories'
export default function Home() {
 return (<><Welcome /><Hero /><div className="grid gap-5 p-5 xl:grid-cols-[1fr_300px]"><div className="min-w-0 space-y-5"><ModuleCards /><div className="grid gap-5 lg:grid-cols-[1.35fr_1fr]"><RegionExplorer /><FeaturedWord /></div><Stories /></div><RightRail /></div></>)
}
