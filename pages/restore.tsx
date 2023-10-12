import { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useState } from 'react';
import { UrlBuilder } from '@bytescale/sdk';
import {
  UploadWidgetConfig,
  UploadWidgetOnPreUploadResult,
} from '@bytescale/upload-widget';
import { UploadDropzone } from '@bytescale/upload-widget-react';
import { CompareSlider } from '../components/CompareSlider';
import Footer from '../components/Footer';
import Header from '../components/Header';
import LoadingDots from '../components/LoadingDots';
import Toggle from '../components/Toggle';
import appendNewToName from '../utils/appendNewToName';
import downloadPhoto from '../utils/downloadPhoto';
import NSFWFilter from 'nsfw-filter';
import va from '@vercel/analytics';
import { useSession, signIn } from 'next-auth/react';
import useSWR from 'swr';
import { Rings } from 'react-loader-spinner';

const Home: NextPage = () => {
  const [originalPhoto, setOriginalPhoto] = useState<string>('');
  const [restoredImage, setRestoredImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [restoredLoaded, setRestoredLoaded] = useState<boolean>(false);
  const [sideBySide, setSideBySide] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState<string>('');
  const [prompt, setPrompt] = useState<string>('');
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  // const { data, mutate } = useSWR('/api/remaining', fetcher);
  const { data: session, status } = useSession();


  const handleGenerateClick = async () => {
    if (!prompt) {
      // Handle empty prompt case (show error, disable button, etc.)
      return;
    }

    // Call the API function to generate photo with the given prompt
    try {
      const imageUrl = prompt; 
      console.log(imageUrl);

      setOriginalPhoto(imageUrl);
      // setPhotoName(imageUrl);
      //     generatePhoto(imageUrl);// Use the text prompt as the image URL
      await generatePhoto(imageUrl);
      // Handle success, update state, etc.
    } catch (error) {
      // Handle error, show error message, etc.
    }
  };


  // const options: UploadWidgetConfig = {
  //   apiKey: !!process.env.NEXT_PUBLIC_UPLOAD_API_KEY
  //     ? process.env.NEXT_PUBLIC_UPLOAD_API_KEY
  //     : 'free',
  //   maxFileCount: 1,
  //   mimeTypes: ['image/jpeg', 'image/png', 'image/jpg'],
  //   editor: { images: { crop: false } },
  //   styles: { colors: { primary: '#000' } },
  //   onPreUpload: async (
  //     file: File
  //   ): Promise<UploadWidgetOnPreUploadResult | undefined> => {
  //     let isSafe = false;
  //     try {
  //       isSafe = await NSFWFilter.isSafe(file);
  //       console.log({ isSafe });
  //       if (!isSafe) va.track('NSFW Image blocked');
  //     } catch (error) {
  //       console.error('NSFW predictor threw an error', error);
  //     }
  //     if (!isSafe) {
  //       return { errorMessage: 'Detected a NSFW image which is not allowed.' };
  //     }
  //     // if (data.remainingGenerations === 0) {
  //     //   return { errorMessage: 'No more generations left for the day.' };
  //     // }
  //     return undefined;
  //   },
  // };

  const UploadDropZone = () => (
    // <UploadDropzone
    //   options={options}
      // onUpdate={({ uploadedFiles }) => {
      //   if (uploadedFiles.length !== 0) {
      //     const image = uploadedFiles[0];
      //     const imageName = image.originalFile.originalFileName;
      //     const imageUrl = UrlBuilder.url({
      //       accountId: image.accountId,
      //       filePath: image.filePath,
      //       options: {
      //         transformation: 'preset',
      //         transformationPreset: 'thumbnail',
      //       },
      //     });
      //     setPhotoName(imageName);
      //     setOriginalPhoto(imageUrl);
      //     generatePhoto(imageUrl);
    //     }
    //   }}
    //   width="670px"
    //   height="250px"
    // />

    <div className="relative flex h-12 w-full min-w-[400px] max-w-[24rem] ">
  <input
    type="text"
    className="peer h-full w-full rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-2.5 pr-20 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
    placeholder=" "
    value={prompt}
    onChange={(e) => setPrompt(e.target.value)}
    required
  />
  <button
    className="!absolute right-1 top-1 z-10 select-none rounded bg-gray-900 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-gray-900/20 transition-all hover:shadow-lg hover:shadow-gray-900/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none peer-placeholder-shown:pointer-events-none peer-placeholder-shown:bg-blue-gray-500 peer-placeholder-shown:opacity-50 peer-placeholder-shown:shadow-none"
    type="button"
    onClick={handleGenerateClick}
  >
    Go
  </button>
  <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
    Write Logo Prompt here
  </label>
</div>
   
    // <button className="bg-gray-900 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Go</button>
  );

  async function generatePhoto(fileUrl: string) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    setLoading(true);

    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageUrl: fileUrl }),
    });

    let newPhoto = await res.json();
    if (res.status !== 200) {
      setError(newPhoto);
    } else {
      // mutate();
      setOriginalPhoto(newPhoto);
      setRestoredImage(newPhoto);
    }
    setLoading(false);
  }

  return (
    <div className="flex max-w-6xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Head>
        <title>Generate Logo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header photo={session?.user?.image || undefined} />
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-4 sm:mb-0 mb-8">
        <a
          href="https://twitter.com/nutlope/status/1626074563481051136"
          target="_blank"
          rel="noreferrer"
          className="border rounded-2xl py-1 px-4 text-slate-500 text-sm mb-5 hover:text-slate-600 transition duration-300 ease-in-out"
        >
          <span className="font-semibold">1000+ logos</span> generated and
          counting
        </a>
        <h1 className="mx-auto max-w-4xl font-display text-4xl font-bold tracking-normal text-slate-900 sm:text-6xl mb-5">
          Generate Logo using AI
        </h1>
        {/* {status === 'authenticated' && data && (
          <p className="text-slate-500">
            You have{' '}
            <span className="font-semibold">
              {data.remainingGenerations} generations
            </span>{' '}
            left today. Your generation
            {Number(data.remainingGenerations) > 1 ? 's' : ''} will renew in{' '}
            <span className="font-semibold">
              {data.hours} hours and {data.minutes} minutes.
            </span>
          </p>
        )} */}
        <div className="flex justify-between items-center w-full flex-col mt-4">
          <Toggle
            className={`${restoredLoaded ? 'visible mb-6' : 'invisible'}`}
            sideBySide={sideBySide}
            setSideBySide={(newVal) => setSideBySide(newVal)}
          />
          {restoredLoaded && sideBySide && (
            <CompareSlider
              original={originalPhoto!}
              restored={restoredImage!}
            />
          )}
          {status === 'loading' ? (
            <div className="max-w-[670px] h-[250px] flex justify-center items-center">
              <Rings
                height="100"
                width="100"
                color="black"
                radius="6"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
                ariaLabel="rings-loading"
              />
            </div>
          ) 
          
          : status === 'authenticated' && !originalPhoto ? (
            <UploadDropZone />
          ) : (
            !originalPhoto && (
              <div className="h-[250px] flex flex-col items-center space-y-6 max-w-[670px] -mt-8">
                <div className="max-w-xl text-gray-600">
                  Sign in below with Google to create a free account and restore
                  your photos today. You will be able to restore 5 photos per
                  day for free.
                </div>
                <button
                  onClick={() => signIn('google')}
                  className="bg-gray-200 text-black font-semibold py-3 px-6 rounded-2xl flex items-center space-x-2"
                >
                  <Image
                    src="/google.png"
                    width={20}
                    height={20}
                    alt="google's logo"
                  />
                  <span>Sign in with Google</span>
                </button>
              </div>
            )
          )}
          {originalPhoto && restoredImage && (
            <input
            type="image"
            alt="original input"
            src={restoredImage}
            className="rounded-2xl"
            width={475}
            height={475}
            onClick={() => window.open(originalPhoto, '_blank')}
          />
          )}
          {/* {restoredImage ? (
            <div className="flex sm:space-x-4 sm:flex-row flex-col">
               {/* <div> */}
                 {/* <h2 className="mb-1 font-medium text-lg">Original Photo</h2> */}
                {/* <Image
                  alt="original photo"
                  src={originalPhoto}
                  className="rounded-2xl relative"
                  width={475}
                  height={475}
                /> */}
              {/* </div> */}
              {/* <div className="sm:mt-0 mt-8">
                <h2 className="mb-1 font-medium text-lg">Restored Photo</h2>
                <a href={restoredImage} target="_blank" rel="noreferrer">
                  <Image
                    alt="restored photo"
                    src={restoredImage}
                    className="rounded-2xl relative sm:mt-0 mt-2 cursor-zoom-in"
                    width={475}
                    height={475}
                    onLoadingComplete={() => setRestoredLoaded(true)}
                  /> */}
                  {/* <Image
                  alt="original photo"
                  src={originalPhoto}
                  className="rounded-2xl relative"
                  width={475}
                  height={475}
                /> */}
                {/* </a> */}
              {/* </div> */}
            {/* </div> */}
          {/* // ):( */} 
        {/* //     <span className="text-red-500">
        //       Error: Failed to load the restored photo.
        //     </span>
        //   )
        
        // } */}
          {loading && (
            <button
              disabled
              className="bg-black rounded-full text-white font-medium px-4 pt-2 pb-3 mt-8 hover:bg-black/80 w-40"
            >
              <span className="pt-4">
                <LoadingDots color="white" style="large" />
              </span>
            </button>
          )}
          {error && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mt-8 max-w-[575px]"
              role="alert"
            >
              <div className="bg-red-500 text-white font-bold rounded-t px-4 py-2">
                Please try again in 24 hours
              </div>
              <div className="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700">
                {error}
              </div>
            </div>
          )}
          <div className="flex space-x-2 justify-center">
            {originalPhoto && !loading && (
              <button
                onClick={() => {
                  // setOriginalPhoto(null); 
                  setRestoredImage(null);
                  setRestoredLoaded(false);
                  setError(null);
                }}
                className="bg-black rounded-full text-white font-medium px-4 py-2 mt-8 hover:bg-black/80 transition"
              >
                nehh, don't like it :( 
              </button>
            )}
            {restoredImage && (
              <button
                onClick={() => {
                  downloadPhoto(restoredImage!, appendNewToName(photoName!));
                }}
                className="bg-white rounded-full text-black border font-medium px-4 py-2 mt-8 hover:bg-gray-100 transition"
              >
                Download Logo
              </button>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
