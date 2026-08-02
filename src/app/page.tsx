import {
  ButtonPrimary,
  ButtonCancelar,
  ButtonEditar,
  ButtonForward,
  ButtonAdd,
  ButtonNavTile,
  ButtonFinDia,
} from "@/components/buttons";
import { ItemTracker, ItemFoodList } from "@/components/lists";
import { NavBar, TitleBar } from "@/components/common";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f3f7e6] text-black p-6 md:p-12 font-mono flex flex-col items-center justify-center gap-10">
      <div className="w-full max-w-4xl bg-[#f7faeb] border border-zinc-200 rounded-3xl p-6 md:p-10 shadow-xl">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-10 tracking-tight">
          UI Kit Componentes
        </h1>

        {/* Componente TitleBar (Marca/Título) */}
        <div className="border border-dashed border-purple-300 rounded-2xl p-6 bg-white/50 mb-12">
          <h2 className="text-xl font-bold text-center mb-4">Marca / Título (TitleBar)</h2>
          <TitleBar title="MiApp" />
        </div>

        {/* Top Grid of Main Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-start mb-12">
          {/* Primario */}
          <div className="border border-dashed border-purple-300 rounded-2xl p-4 flex flex-col items-center gap-4 bg-white/50">
            <span className="text-sm font-semibold text-zinc-600">Primario</span>
            <ButtonPrimary variant="default" />
            <ButtonPrimary variant="pressed" />
          </div>

          {/* Cancelar */}
          <div className="border border-dashed border-purple-300 rounded-2xl p-4 flex flex-col items-center gap-4 bg-white/50">
            <span className="text-sm font-semibold text-zinc-600">Cancelar</span>
            <ButtonCancelar variant="default" />
            <ButtonCancelar variant="pressed" />
          </div>

          {/* Editar */}
          <div className="border border-dashed border-purple-300 rounded-2xl p-4 flex flex-col items-center gap-4 bg-white/50">
            <span className="text-sm font-semibold text-zinc-600">Editar</span>
            <ButtonEditar variant="default" />
            <ButtonEditar variant="pressed" />
          </div>

          {/* ButtonForward (Ver Más) */}
          <div className="border border-dashed border-purple-300 rounded-2xl p-4 flex flex-col items-center gap-4 bg-white/50">
            <span className="text-sm font-semibold text-zinc-600">Ver Más</span>
            <ButtonForward variant="default" />
            <ButtonForward variant="pressed" />
          </div>

          {/* ButtonAdd (Agregar) */}
          <div className="border border-dashed border-purple-300 rounded-2xl p-4 flex flex-col items-center gap-4 bg-white/50">
            <span className="text-sm font-semibold text-zinc-600">Agregar</span>
            <ButtonAdd variant="default" />
            <ButtonAdd variant="pressed" />
          </div>
        </div>

        {/* Bottom Grid of Nav & Fin Día Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-5 gap-6 items-start mb-12">
          {/* Inicio */}
          <div className="border border-dashed border-purple-300 rounded-2xl p-4 flex flex-col items-center gap-4 bg-white/50">
            <span className="text-sm font-semibold text-zinc-600">Inicio</span>
            <ButtonNavTile iconType="inicio" variant="default" />
            <ButtonNavTile iconType="inicio" variant="pressed" />
          </div>

          {/* Lista */}
          <div className="border border-dashed border-purple-300 rounded-2xl p-4 flex flex-col items-center gap-4 bg-white/50">
            <span className="text-sm font-semibold text-zinc-600">Lista</span>
            <ButtonNavTile iconType="lista" variant="default" />
            <ButtonNavTile iconType="lista" variant="pressed" />
          </div>

          {/* Grupo */}
          <div className="border border-dashed border-purple-300 rounded-2xl p-4 flex flex-col items-center gap-4 bg-white/50">
            <span className="text-sm font-semibold text-zinc-600">Grupo</span>
            <ButtonNavTile iconType="grupo" variant="default" />
            <ButtonNavTile iconType="grupo" variant="pressed" />
          </div>

          {/* Ajustes */}
          <div className="border border-dashed border-purple-300 rounded-2xl p-4 flex flex-col items-center gap-4 bg-white/50">
            <span className="text-sm font-semibold text-zinc-600">Ajustes</span>
            <ButtonNavTile iconType="ajustes" variant="default" />
            <ButtonNavTile iconType="ajustes" variant="pressed" />
          </div>

          {/* Fin Día */}
          <div className="col-span-2 sm:col-span-1 border border-dashed border-purple-300 rounded-2xl p-4 flex flex-col items-center gap-4 bg-white/50">
            <span className="text-sm font-semibold text-zinc-600">Fin Día</span>
            <ButtonFinDia variant="default" />
            <ButtonFinDia variant="pressed" />
          </div>
        </div>

        {/* Componente NavBar (Barra de Navegación) */}
        <div className="border border-dashed border-purple-300 rounded-2xl p-6 bg-white/50 mb-12">
          <h2 className="text-xl font-bold text-center mb-4">Barra Navegación (NavBar)</h2>
          <NavBar activeTab="inicio" />
        </div>

        {/* Grid de Componentes de Listas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Componente ItemTracker */}
          <div className="border border-dashed border-purple-300 rounded-2xl p-6 bg-white/50">
            <h2 className="text-xl font-bold text-center mb-4">Item Tracker</h2>
            <div className="flex flex-col gap-3">
              <ItemTracker cal={150} name="Alimento" />
              <ItemTracker cal={250} name="Manzana verde" />
            </div>
          </div>

          {/* Componente ItemFoodList */}
          <div className="border border-dashed border-purple-300 rounded-2xl p-6 bg-white/50">
            <h2 className="text-xl font-bold text-center mb-4">Item Lista de Alimentos</h2>
            <div className="flex flex-col gap-3">
              <ItemFoodList name="Alimento" />
              <ItemFoodList name="Pechuga de Pollo" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
