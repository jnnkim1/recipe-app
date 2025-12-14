import Link from "next/link";

export default function Card({ image, title, description, buttonText, link }) {
  return (
    <div className="flex flex-col items-center text-center m-4 p-4">
      <div className="w-[300px] h-[300px] overflow-hidden mb-4">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      <div>
        <h1 className="text-3xl font-bold text-[#D17368]">{title}</h1>
        <p>{description}</p>
      </div>
      <section className="w-full">
        <Link href={link}>
          <button
            className="bg-[#D17368] w-full mt-5 text-white font-semibold py-3 rounded-xl hover:bg-[#b5645b] transition duration-300 cursor-pointer">
            {buttonText}
          </button>
        </Link>
      </section>
    </div>
  )
}