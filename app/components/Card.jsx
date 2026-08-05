import Link from "next/link";

export default function Card({ image, icon: Icon, title, description, buttonText, link, onClick }) {
  const button = (
    <button
      type="button"
      onClick={onClick}
      className="mt-5 w-full cursor-pointer rounded-xl bg-[#D17368] py-3 font-semibold text-white transition duration-300 hover:bg-[#b5645b]"
    >
      {buttonText}
    </button>
  );

  return (
    <div className="flex flex-col items-center text-center m-4 p-4">
      <div className="mb-4 flex h-[300px] w-[300px] items-center justify-center overflow-hidden">
        {Icon ? (
          <Icon
            aria-label={title}
            className="h-full w-full p-10 text-[#D17368]"
            strokeWidth={1.5}
          />
        ) : (
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover"
          />
        )}
      </div>
      <div>
        <h1 className="text-3xl font-bold text-[#D17368]">{title}</h1>
        <p>{description}</p>
      </div>
      <section className="w-full">
        {link ? <Link href={link}>{button}</Link> : button}
      </section>
    </div>
  )
}
