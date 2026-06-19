function FloatingBackground() {
  return (
    <>
      <div className="fixed top-[-200px] left-[-200px] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl"></div>

      <div className="fixed bottom-[-200px] right-[-200px] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl"></div>

      <div className="fixed top-[40%] left-[40%] w-[300px] h-[300px] bg-pink-500/5 rounded-full blur-3xl"></div>
    </>
  )
}

export default FloatingBackground